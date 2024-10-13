from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from app.core.models import User, UserInDB
from app.configurations import Configs
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

configs = Configs()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Esquema OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Base de datos simulada
fake_users_db = {
    "Admin1": {
        "username": "Admin1",
        "full_name": "Juan David",
        "hashed_password": pwd_context.hash("1234"),
        "disabled": False,
    }
}

# Funciones de autenticación
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db, username: str) -> Optional[UserInDB]:
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    user = get_user(fake_users_db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=configs.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, configs.secret_key, algorithm=configs.algorithm)
    return encoded_jwt

# Función para obtener el usuario actual
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, configs.secret_key, algorithms=[configs.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = {"username": username}
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data["username"])
    if user is None:
        raise credentials_exception
    return user
