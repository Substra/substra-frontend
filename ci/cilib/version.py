""" Functions for manipulating the version file """

import dataclasses
import logging
import os.path
import re
from typing import Union

from . import command, docker, file_system, git

logger = logging.getLogger(__name__)

_COMMIT_MIN_LENGTH = 7
_HISTORY_TAG_SEARCH_DEPTH = 15


@dataclasses.dataclass
class Version:
    major: int
    minor: int
    patch: int
    prerelease: str = ""
    buildmetadata: str = ""
    prefix: str = ""  # not semver, prefixes the version
    suffix: str = ""  # not semver, suffixes the version
    pre_and_suffix_separator = "-"

    @classmethod
    def from_match(cls, match: re.Match):
        d = match.groupdict()
        return cls(
            major=d["major"],
            minor=d["minor"],
            patch=d["patch"],
            prerelease=d["prerelease"],
            buildmetadata=d["buildmetadata"],
        )

    @property
    def number(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

    @property
    def semver(self) -> str:
        result = self.number
        if self.prerelease:
            result += "-" + self.prerelease
        if self.buildmetadata:
            result += "+" + self.buildmetadata
        return result

    @property
    def tag(self):
        """
        https://docs.docker.com/engine/reference/commandline/tag/#extended-description
        A tag name must be valid ASCII and may contain lowercase and uppercase letters,
        digits, underscores, periods and dashes. A tag name may not start with a period
        or a dash and may contain a maximum of 128 characters.
        """
        return self._append_fixes(
            re.sub(r"[^0-9a-zA-Z_.-]+", "_", self.semver.casefold())
        )

    @property
    def url(self):
        return self._append_fixes(re.sub(r"[^0-9a-zA-Z]+", "-", self.semver.casefold()))

    def __repr__(self):
        return self._append_fixes(self.semver)

    def _append_fixes(self, s):
        result = s
        if self.prefix:
            result = self.prefix + self.pre_and_suffix_separator + result
        if self.suffix:
            result += self.pre_and_suffix_separator + self.suffix
        return result


class InvalidVersionFileError(Exception):
    pass


class InvalidSemVerError(Exception):
    pass


class InvalidDockerTagError(Exception):
    pass


class InvalidURLerror(Exception):
    pass


def match_semver(
    version: str,
) -> Union[re.Match, None]:
    # source:
    # https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    return re.match(
        r"^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)"
        + r"(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)"
        + r"(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?"
        + r"(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$",
        version,
    )


def parse_semver(version: str) -> Union[Version, None]:
    m = match_semver(version)
    if m:
        return Version.from_match(m)
    return None


def get_default_version_file_location_in_fs() -> str:
    return os.path.join(file_system.get_repo_base_dir(), "version")


def parse_version_file(contents: str) -> Version:
    def strip_line(line: str) -> str:
        return line.split("#")[0].strip()

    lines = [strip_line(line) for line in contents.splitlines() if strip_line(line)]
    if len(lines) != 1:
        raise InvalidVersionFileError(
            "The version file does not contain exactly one SemVer2 string"
            + " on its own line"
        )
    m = parse_semver(lines[0])
    if not m:
        raise InvalidVersionFileError(
            "The version file does not contain a valid SemVer2 string"
        )
    return m


def get_version_from_ref(ref: str = "HEAD", version_file_path="version") -> Version:
    return parse_version_file(
        command.get_output(
            ["git", "show", f"{git.resolve_ref(ref)}:{version_file_path}"]
        )
    )


def get_version_from_path(version_file_path="version") -> Version:
    with open(version_file_path) as f:
        return parse_version_file(f.read())


def produce_version(version: Version, insert={}) -> Version:
    """
    take a Version and return a copy modified with the contents of the insert dict
    """

    def get_transformed_part(part_name):
        part = (
            ""
            if getattr(version, part_name, "") is None
            else getattr(version, part_name, "")
        )
        for i in insert.get(part_name, []):
            if "prepend" in i and part != "":
                part = "." + part
            part = i.get("prepend", "") + part
            if "append" in i and part != "":
                part += "."
            part += i.get("append", "")
            if "replace" in i:
                part = i["replace"]
        if part == "":
            return ""
        return part

    result = dataclasses.replace(
        version,
        prerelease=get_transformed_part("prerelease"),
        buildmetadata=get_transformed_part("buildmetadata"),
        prefix=get_transformed_part("prefix"),
        suffix=get_transformed_part("suffix"),
    )

    if not match_semver(result.semver):
        raise InvalidSemVerError(f"Produced string ({result}) is invalid SemVer2")

    return result


def produce_fallback_tag(max_length, id, prefix="", suffix=""):
    desired_id_length = max_length
    prefix = prefix or ""
    if prefix[-1] != "-":
        prefix += "-"
    desired_id_length -= len(prefix)

    suffix = suffix or ""
    if suffix[0] != "-":
        suffix = "-" + suffix
    desired_id_length -= len(suffix)
    if desired_id_length < _COMMIT_MIN_LENGTH:
        raise Exception(
            f"Produced tag doen't have enough space for commit id: {prefix}<id>{suffix}"
        )
    return f"{prefix}{id[:desired_id_length]}{suffix}"


def produce_tag(version: Version, max_length: int = None, length_fallback=False) -> str:
    result = version.tag

    if max_length and len(result) > max_length:
        if length_fallback:
            return produce_fallback_tag(
                max_length, git.long_id(), version.prefix, version.suffix
            )
        raise InvalidDockerTagError(
            f"Produced tag is >{max_length} characters: {result}"
        )
    return result


def produce_url(version: Version, max_length: int = None, length_fallback=False) -> str:
    result = version.url

    if max_length and len(result) > max_length:
        if length_fallback:
            return produce_fallback_tag(
                max_length, git.long_id(), version.prefix, version.suffix
            )
        raise InvalidURLerror(f"Produced URL is >{max_length} characters: {result}")

    # regex from here https://github.com/helm/helm/issues/6477
    if re.match(
        r"[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*", result
    ):
        return result
    raise InvalidURLerror("Produced URL ({result}) is not k8s-compliant")


def get_tag(ref=None) -> str:
    """
    ref=None means current directory
    """
    if ref:
        base_version = get_version_from_ref(ref)
        short_id = git.short_id(ref)
    else:
        base_version = get_version_from_path(get_default_version_file_location_in_fs())
        short_id = git.short_id()

    return produce_tag(
        produce_version(
            base_version,
            insert={"buildmetadata": [{"append": short_id}]},
        ),
        max_length=128,
    )


def get_most_recent_tag_from_registry(
    registry_url, name, starting_ref="HEAD"
) -> Union[str, None]:
    """
    try to find the most recent image on the distant repo that is from a parent commit
    returns an entire tag (registry/name:tag), or None in case of failure

    relies on the fact that images are tagged with the short commit id exclusively
    """
    # this is slow.. We could do it all in parallel
    commit_id = command.get_output(["git", "rev-parse", starting_ref])
    for iteration in range(_HISTORY_TAG_SEARCH_DEPTH):
        try:
            tag = get_tag(commit_id)
        except InvalidVersionFileError:  # to handle the switch in version file formats
            tag = git.short_id(commit_id)
        logger.debug(f"Searching for cache from parents {iteration} {commit_id} {tag}")
        try:
            full_tag = f"{registry_url}/{name}:{tag}"
            manifest = docker.manifest_inspect(full_tag)
            if manifest is not None:
                logger.debug(
                    f"Found parent image {full_tag} after {iteration} iterations"
                )
                return full_tag
        except command.SubProcessException as e:
            logger.debug(f"Failed to find a most recent tag from registry:\n{e}")
        try:
            # always go left, some heuristic about when to go left/right might be better
            commit_id = command.get_output(["git", "rev-parse", f"{commit_id}^1"])
        except command.SubProcessException as e:
            logger.debug(f"Failed to find a most recent tag from registry:\n{e}")
            return None
    return None
