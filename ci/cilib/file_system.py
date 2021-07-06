import os


def get_repo_base_dir():
    file_dir = os.path.dirname(os.path.realpath(__file__))
    base_dir = os.path.realpath(os.path.join(file_dir, "../.."))  # hardcoded path
    return base_dir


def get_from_repo_root(path):
    return os.path.join(get_repo_base_dir(), path)


def set_wd_to_project_root():
    os.chdir(get_repo_base_dir())
