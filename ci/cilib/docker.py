""" Utility functions for build scripts"""

from dataclasses import dataclass
from typing import Union, List, Dict
import logging
import json

from . import command
from . import version

logger = logging.getLogger(__name__)


def get_full_tag(registry_url, name, tag) -> str:
    return f"{registry_url}/{name}:{tag}"


@dataclass
class BuildKitOptions:
    inline_cache: bool = False
    distant_cache: bool = False
    cache_from: str = None


def build(
    dockerfile_path: str,
    registry_url: str,
    name: str,
    tag: str,
    folder: str,
    buildkit: BuildKitOptions = None,
    extra_docker_args: List[str] = [],
) -> str:
    cmd = ["docker", "build"]
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

    full_tag = get_full_tag(registry_url, name, tag)
    cmd += ["-f", dockerfile_path, "-t", full_tag, folder]
    cmd += extra_docker_args
    logger.info(
        f"Building docker image with:\n{command.get_human_readable_command(cmd)}"
    )

    command.run(cmd, additional_env=env)

    return full_tag


def tag(old, new):
    command.run(["docker", "tag", old, new])


def push(tag):
    command.run(["docker", "push", tag])


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
