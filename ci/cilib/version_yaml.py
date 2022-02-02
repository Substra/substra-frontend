import yaml

from . import command, git, version


def parse_version_file(contents: str, key="version") -> version.Version:
    c = yaml.safe_load(contents)
    m = version.parse_semver(c[key])  # can't handle nested keys
    if not m:
        raise version.InvalidVersionFileError(
            "The version file does not contain a valid SemVer2 string"
        )
    return m


def get_version_from_ref(ref: str, version_file_path) -> version.Version:
    return parse_version_file(
        command.get_output(
            ["git", "show", f"{git.resolve_ref(ref)}:{version_file_path}"]
        )
    )


def get_version_from_path(version_file_path) -> version.Version:
    with open(version_file_path) as f:
        return parse_version_file(f.read())
