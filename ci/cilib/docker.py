""" Utility functions for build scripts"""

import json
import logging
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Union

from . import command, version

logger = logging.getLogger(__name__)


def format_tag(registry_url: str, name: str, tag: str) -> str:
    return f"{registry_url}/{name}:{tag}"


def parse_tag(full_tag: str) -> tuple[str, str, str]:
    m = re.match(
        r"^(?:(?P<registry>.+)/)(?P<name>[^:]+)(?::(?P<version>.+))$", full_tag
    )
    if not m:
        raise ValueError(f"Improper tag (should be registry/name:version): {full_tag}")
    return m.group("registry"), m.group("name"), m.group("version")


@dataclass
class BuildKitOptions:
    inline_cache: bool = False
    distant_cache: bool = False
    cache_from: Optional[str] = None


def build(
    working_directory: str,
    dockerfile_path: str,
    full_tag: str,
    buildkit: BuildKitOptions = None,
    extra_docker_args: List[str] = [],
):
    cmd = ["docker", "build"]
    registry_url, name, _ = parse_tag(full_tag)
    env = {}
    if buildkit:
        env = {"DOCKER_BUILDKIT": "1"}
        if buildkit.inline_cache:
            cmd += ["--build-arg", "BUILDKIT_INLINE_CACHE=1"]
        if buildkit.distant_cache:
            cache_from = (
                buildkit.cache_from
                or version.get_most_recent_tag_from_registry(registry_url, name)
            )
            if cache_from:
                cmd += ["--cache-from", cache_from]

    cmd += ["-f", dockerfile_path, "-t", full_tag, working_directory]
    cmd += extra_docker_args
    logger.info(
        f"Building docker image with:\n{command.get_human_readable_command(cmd)}"
    )

    return command.run(cmd, additional_env=env)


def tag(old, new):
    return command.run(["docker", "tag", old, new])


def push(tag):
    return command.run(["docker", "push", tag])


def pull(tag):
    return command.run(["docker", "pull", tag])


def rmi(tag):
    return command.run(["docker", "rmi", tag])


def manifest_inspect(tag) -> Union[Dict, None]:
    try:
        o = command.get_output(
            [
                "docker",
                "manifest",
                "inspect",
                tag,
            ]
        )
        return json.loads(o)
    except command.SubProcessException as e:
        if "no such manifest" in e.message:
            return None
        raise e
