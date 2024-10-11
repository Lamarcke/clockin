import os.path
from pathlib import Path


def get_project_root() -> Path:
    return Path(__file__).parent.parent.parent


def get_uploads_root_path() -> str:
    return f"{get_project_root()}/public/uploads"
