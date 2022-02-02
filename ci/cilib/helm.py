import filecmp
import logging
import re
import tarfile
from os import mkdir, remove
from shutil import rmtree
from time import sleep
from typing import List, Union
from urllib.parse import urljoin

import requests
import yaml

from . import command
from .formatting import split_creds

logger = logging.getLogger()


class NonextantChartException(Exception):
    pass


class AlreadyExtantChartException(Exception):
    pass


def get_index(url, creds) -> dict:
    r = requests.get(urljoin(url, "index.yaml"), auth=split_creds(creds))
    r.raise_for_status()
    return yaml.safe_load(r.text)


def get_url(url, creds, chart_name, version, try_again=True) -> Union[str, None]:
    """
    whether the given version exists on the server
    Build metadata is taken into account
    """
    i = get_index(url, creds)
    if not chart_name in i["entries"]:
        return None
    for e in i["entries"][chart_name]:
        if e["version"] == version:
            for u in e["urls"]:
                if u.endswith(".tgz"):
                    return urljoin(url, u)
            if try_again:
                sleep(10)  # give the server time to settle
                return get_url(url, creds, chart_name, version, try_again=False)
            raise Exception("Chart is listed on the server but has no valid URL")
    return None


def get_matching_urls(url, creds, chart_name, version, try_again=True) -> List[str]:
    """
    Return a list of all URLs matching the given version
    Build metadata is ignored as per semver rules
    """
    version = version.split("+")[0]
    matches: List[str] = []
    i = get_index(url, creds)
    if not chart_name in i["entries"]:
        return matches
    for e in i["entries"][chart_name]:
        if e["version"].split("+")[0] == version:
            had_valid_urls = False
            for u in e["urls"]:
                if u.endswith(".tgz"):
                    matches.append(urljoin(url, u))
                    had_valid_urls = True
            if not had_valid_urls:
                if try_again:
                    sleep(10)  # give the server time to settle
                    return get_matching_urls(
                        url, creds, chart_name, version, try_again=False
                    )
                raise Exception(
                    f"Chart is listed on the server (version {e['version']}) but has no valid URL"
                )
    return matches


def download(url, creds, chart_name, version, output_filename=None):
    expected_name = f"{chart_name}-{version}.tgz"
    if not output_filename:
        output_filename = expected_name
    chart_url = get_url(url, creds, chart_name, version)
    if not chart_url:
        raise NonextantChartException(urljoin(url, f"charts/{expected_name}"))

    with requests.get(chart_url, auth=split_creds(creds), stream=True) as r:
        r.raise_for_status()
        with open(output_filename, "wb") as f:
            for chunk in r.iter_content():
                f.write(chunk)

    return output_filename


def upload(url, creds, chart_path, dry_run=False) -> None:
    with tarfile.open(chart_path) as t:
        f = [
            x
            for x in t.getmembers()
            if re.search(r"^[a-z0-9]([-a-z0-9]*[a-z0-9])?/Chart.yaml$", x.name)
        ]
        assert len(f) == 1
        data = t.extractfile(f[0])
        assert data is not None
        local_chart_metadata = yaml.safe_load(data)
    if already_extant_url := get_url(
        url, creds, local_chart_metadata["name"], local_chart_metadata["version"]
    ):
        mkdir(".local-chart")
        with tarfile.open(chart_path) as t:
            t.extractall(path=".local-chart")
        download(
            url,
            creds,
            local_chart_metadata["name"],
            local_chart_metadata["version"],
            output_filename=".ref.tgz",
        )
        mkdir(".ref")
        with tarfile.open(".ref.tgz") as t:
            t.extractall(path=".ref")

        c = filecmp.dircmp(".ref", ".local-chart")

        def get_problem_files(d):  # I can't believe I have to do this myself
            problem_files = d.diff_files + d.funny_files
            problem_files = [f"{d.left}/{x}" for x in problem_files]
            for subd in d.subdirs.values():
                problem_files += get_problem_files(subd)
            return problem_files

        problem_files = get_problem_files(c)
        try:
            rmtree(".local-chart")
            remove(".ref.tgz")
            rmtree(".ref")
        except FileNotFoundError:
            pass
        if len(problem_files) != 0:
            raise AlreadyExtantChartException(
                f"Chart {chart_path} already exists on the repo ({already_extant_url}) but isn't the same file and I won't overwrite it\nDifferences: {problem_files}"
            )
        logger.info(f"Skipping upload of {chart_path}")
    elif dry_run:
        logger.info(f"DRY RUN: Would upload {chart_path} to {url}")
    else:
        try:
            command.run(
                [
                    "helm",
                    "plugin",
                    "install",
                    "https://github.com/chartmuseum/helm-push.git",
                ],
                capture_output=True,
            )
        except command.SubProcessException as e:
            if "Error: plugin already exists" not in e.message:
                raise e
        p = command.run(
            [
                "helm",
                "cm-push",
                chart_path,
                url,
                "--username",
                split_creds(creds)[0],
                "--password",
                split_creds(creds)[1],
            ],
            capture_output=True,
        )
        logger.info(p.stdout)


def delete(url, creds, chart_name, version):
    """
    this is specific to ChartMuseum
    because, guess what, this is NOT SPECIFIED. There is no mention of deletion in the
    Helm HTTP API. It just tells you how to retrieve charts from a server, not how they
    get there.
    """
    return command.run(
        [
            "curl",
            "-u",
            creds,
            "--fail",
            "--silent",
            "-X",
            "DELETE",
            f"{url}/api/charts/{chart_name}/{version}",
        ]
    )


def install(chart_path, namespace, name, values_files: List[str], values: List[str]):
    cmd = [
        "helm",
        "upgrade",
        "--install",
        "--create-namespace",
        name,
        "-n",
        namespace,
        chart_path,
    ]
    for f in values_files:
        cmd += ["--values", f]
    for v in values:
        cmd += ["--set", v]

    return command.run(cmd)
