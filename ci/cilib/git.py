from datetime import datetime
from . import command

SHORT_ID_LENGTH = 7


def id(ref="HEAD"):
    return resolve_ref(ref)


def short_id(ref="HEAD"):
    return id(ref)[:SHORT_ID_LENGTH]


def rev_parse(ref):
    return command.get_output(["git", "rev-parse", ref])


def date(ref: str) -> datetime:
    return datetime.fromtimestamp(
        int(
            command.get_output(
                ["git", "show", "-s", r"--format=%ct", resolve_ref(ref), "--"]
            )
        )
    )


def show_ref(ref: str) -> str:
    if ref == "HEAD":
        raise Exception("git.show_ref can't handle HEAD")
    return command.get_output(["git", "show-ref", "--hash", ref]).splitlines()[0]


def resolve_ref(ref: str) -> str:
    """
    tries to rev_parse, if it doesn't work try show_ref,
    but also handles carets ^ and tildes ~
    returns a commit hash
    """
    try:
        return rev_parse(ref)
    except command.SubProcessException:
        pass

    suffix = ""
    if "^" in ref:
        index = ref.find("^")
        suffix = ref[index:]
        ref = ref[:index]
    if ref != "HEAD":
        ref = show_ref(ref)
    if ref == "HEAD" or suffix:
        ref = rev_parse(ref + suffix)
    return ref
