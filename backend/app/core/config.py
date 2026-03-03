import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


def _load_env() -> None:
    """
    Load .env from the project root (hrmss/.env) if available.
    """
    # app/core/config.py -> app/core -> app -> backend -> hrmss
    root_candidate = Path(__file__).resolve().parents[3]
    env_path = root_candidate / ".env"
    if env_path.exists():
        load_dotenv(env_path)


_load_env()


@dataclass
class Settings:
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    mongo_db_name: str = os.getenv("MONGO_DB_NAME", "hrms_lite")


settings = Settings()

