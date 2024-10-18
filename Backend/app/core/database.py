
from motor.motor_asyncio import AsyncIOMotorClient
from app.configurations import Configs

configs = Configs()

try:
    client = AsyncIOMotorClient(configs.mongodb_uri)
    db = client[configs.mongodb_name]
    print("Conexión exitosa a MongoDB")
except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")