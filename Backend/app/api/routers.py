import pydantic
from fastapi import APIRouter,Depends, UploadFile, File , HTTPException, Depends, status
from pydantic import BaseModel
from app import usecases
from app.api import dependencies
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.core.auth import authenticate_user, create_access_token
from app.configurations import Configs
from app.core.utils import extract_text_from_pdf, extract_text_from_docx
from app.core.auth import get_current_user
from app.core.models import User
from app.core.schemas import FormData
from app.core.database import db
from datetime import datetime, date

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.configurations import Configs


configs = Configs()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

rag_router = APIRouter()


class DocumentInput(BaseModel):
    content: str = pydantic.Field(..., min_length=1)
class QueryInput(BaseModel):
    question: str = pydantic.Field(..., min_length=1)


@rag_router.post("/generate-answer/", status_code=200)
async def generate_answer(
    query_input: QueryInput,
    rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance),
):
    return {"answer": rag_service.generate_answer(query_input.question)}


@rag_router.post("/save-document/", status_code=201)
def save_document(document: DocumentInput,
                  rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    rag_service.save_document(content=document.content)
    return {"status": "Document saved successfully"}



@rag_router.post("/upload-pdf/", status_code=201)
async def upload_pdf(
        file: UploadFile = File(...),
        rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance),
        current_user: User = Depends(get_current_user)
):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")
    content = await file.read()
    text = extract_text_from_pdf(content)
    document_id = rag_service.save_document(content=text)
    return {"status": "PDF uploaded and content saved successfully", "id":document_id}

@rag_router.post("/upload-docx/", status_code=201)
async def upload_docx(
        file: UploadFile = File(...),
        rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance),
        current_user:User=Depends(get_current_user),

):
    if file.content_type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        raise HTTPException(status_code=400, detail="El archivo debe ser un DOCX")
    content = await file.read()
    text = extract_text_from_docx(content)
    document_id = rag_service.save_document(content=text)
    return {"status": "DOCX uploaded and content saved successfully", "id":document_id}

@rag_router.delete("/delete-document/{document_id}", status_code=200)
def delete_document(
        document_id: str,
        rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance),
        current_user: User = Depends(get_current_user),
):
    rag_service.delete_document(document_id=document_id)
    return {"status": "Document deleted successfully"}



@rag_router.post("/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}






async def send_email_notification(form_data: FormData, configs: Configs):
    # Crear el mensaje de correo electrónico
    message = MIMEMultipart()
    message["From"] = configs.email_from
    message["To"] = configs.email_to
    message["Subject"] = configs.email_subject

    # Crear el cuerpo del correo electrónico
    body = f"""
    Se ha recibido un nuevo registro:

    Nombre Completo: {form_data.nombre_completo}
    Cédula: {form_data.cedula}
    Convenio: {form_data.convenio}
    Teléfono: {form_data.telefono}
    Fecha de Nacimiento: {form_data.fecha_nacimiento.strftime('%Y-%m-%d')}
    """

    message.attach(MIMEText(body, "plain"))

    # Enviar el correo electrónico
    try:
        await aiosmtplib.send(
            message,
            hostname=configs.email_smtp_server,
            port=configs.email_smtp_port,
            start_tls=True,
            username=configs.email_username,
            password=configs.email_password,
        )
        print("Correo electrónico de notificación enviado exitosamente.")
    except Exception as e:
        print(f"Error al enviar el correo electrónico: {e}")





@rag_router.post("/submit-form/", status_code=201)
async def submit_form(form_data: FormData):
    print("Datos recibidos:", form_data)
    if not form_data.politica_privacidad:
        raise HTTPException(status_code=400, detail="Debe aceptar la política de privacidad.")
    try:
        if isinstance(form_data.fecha_nacimiento, date):
            form_data.fecha_nacimiento = datetime.combine(form_data.fecha_nacimiento, datetime.min.time())
        result = await db["form_submissions"].insert_one(form_data.dict())
        if result.inserted_id:
            print("Datos guardados en MongoDB con ID:", result.inserted_id)
            
            # Enviar correo electrónico de notificación
            configs = Configs()
            await send_email_notification(form_data, configs)
            
            return {"status": "Formulario enviado exitosamente"}
        else:
            print("Error al insertar datos en MongoDB")
            raise HTTPException(status_code=500, detail="Error al guardar los datos.")
    except Exception as e:
        print(f"Error al insertar en MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Error al guardar los datos.")


