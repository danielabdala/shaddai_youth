from pydantic import BaseSettings


class Settings(BaseSettings):

    DATABASE_URL: str
    API_TOKEN: str

    class Config:
        env_file = ".env"


settings = Settings()
