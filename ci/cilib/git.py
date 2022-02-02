from datetime import datetime

from . import command

SHORT_ID_LENGTH = 7


def long_id(ref: str = "HEAD"):
    return resolve_ref(ref)


def short_id(ref: str = "HEAD"):
    return long_id(ref)[:SHORT_ID_LENGTH]


def date(ref: str = "HEAD") -> datetime:
    return datetime.fromtimestamp(
        int(
            command.get_output(
                ["git", "show", "-s", r"--format=%ct", resolve_ref(ref), "--"]
            )
        )
    )


def resolve_ref(ref: str) -> str:
    """
    tries to rev_parse, if it doesn't work try show_ref.
    returns a commit hash
    """
    try:
        return command.get_output(["git", "rev-parse", ref])
    except command.SubProcessException:
        if ref == "HEAD":
            raise ValueError("git.show_ref can't handle HEAD")
        return command.get_output(["git", "show-ref", "--hash", ref]).splitlines()[0]
