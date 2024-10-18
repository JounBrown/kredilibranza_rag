from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FormData(BaseModel):
    nombre_completo: str = Field(..., min_length=1)
    cedula: str = Field(..., min_length=1)
    convenio: str = Field(..., min_length=1)
    telefono: str = Field(..., min_length=1)
    fecha_nacimiento: datetime
    politica_privacidad: bool


