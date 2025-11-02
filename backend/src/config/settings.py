import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = Path(__file__).parent.parent.parent.absolute()


class Settings:
    
    # Server settings
    PORT = int(os.getenv('PORT', 3001))
    HOST = os.getenv('HOST', '0.0.0.0')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Database settings
    DB_PATH = os.getenv('DB_PATH', str(BACKEND_DIR / 'data' / 'app.db'))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.abspath(DB_PATH)}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    @classmethod
    def get_database_uri(cls):
        return cls.SQLALCHEMY_DATABASE_URI
    
    @classmethod
    def ensure_data_dir(cls):
        data_dir = Path(cls.DB_PATH).parent
        data_dir.mkdir(parents=True, exist_ok=True)


settings = Settings()
