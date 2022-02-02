"""
Utility functions for CI scripts

"""

import os
import re
import subprocess
from typing import List


class SubProcessException(Exception):
    def __init__(self, message, action, code):
        super().__init__(message)
        self.message = message if message else ""
        self.action = action
        self.code = code

    def __str__(self):
        return f"{self.action} returned {self.code}" + (
            f":\n{self.message}" if self.message else ""
        )


def _handle_subprocess_error(action: str, p: subprocess.CompletedProcess) -> None:
    if p.returncode == 0:
        return
    messages = []
    if p.stdout:
        messages.append(p.stdout.decode("utf-8"))
    if p.stderr:
        messages.append(p.stderr.decode("utf-8"))
    msg = "\n".join(messages)
    raise SubProcessException(msg, action, p.returncode)


def get_human_readable_command(command: List[str]) -> str:
    result = []
    for i in command:
        if re.search(r"\s", i):
            result.append(f"'{i}'")
        else:
            result.append(i)
    return " ".join(result)


def run(
    command: List[str],
    additional_env={},
    handle_errors=True,
    capture_output=False,
    cwd=None,
) -> subprocess.CompletedProcess:
    description = get_human_readable_command(command)

    env = {**os.environ, **additional_env}
    if additional_env:
        description += f" ### additional env: {additional_env}"

    result = subprocess.run(command, env=env, capture_output=capture_output, cwd=cwd)
    if handle_errors:
        _handle_subprocess_error(description, result)
    if capture_output:
        result.stdout = result.stdout.decode("utf-8").strip()  # type: ignore
        result.stderr = result.stderr.decode("utf-8").strip()  # type: ignore
    return result


def get_output(command: List[str], additional_env={}) -> str:
    return run(command, additional_env, capture_output=True).stdout
