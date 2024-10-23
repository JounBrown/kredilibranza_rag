from app.core.models import Document
from app.core import ports

from app.core.ports import DocumentTextExtractorPort

from app.core.ports import FormRepositoryPort
from app.core.schemas import FormData
from datetime import datetime, date
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from typing import Dict, Any, Tuple
from bson import ObjectId


class RAGService:
    def __init__(self, document_repo: ports.DocumentRepositoryPort, openai_adapter: ports.LlmPort):
        self.document_repo = document_repo
        self.openai_adapter = openai_adapter

    def generate_answer(self, query: str) -> str:
        documents = self.document_repo.get_documents(query)
        if not documents:
            return "No se encontró información relevante en los documentos cargados."
        print(f"Documents: {documents}")
        context = " ".join([doc.content for doc in documents])
        context = context[:2000]
        return self.openai_adapter.generate_text(prompt=query, retrieval_context=context)

    def save_document(self, content: str) -> str:
        document = Document(content=content)
        self.document_repo.save_document(document)
        return document.id

    def delete_document(self, document_id: str) -> None:
        self.document_repo.delete_document(document_id)


class DocumentService:
    def __init__(self, text_extractor: DocumentTextExtractorPort):
        self.text_extractor = text_extractor

    def extract_text(self, file_bytes: bytes) -> str:
        return self.text_extractor.extract_text(file_bytes)




class FormSubmissionService:
    def __init__(self, form_repository: FormRepositoryPort, configs):

        self.form_repository = form_repository
        self.configs = configs

    async def _send_email_notification(self, form_data: FormData) -> bool:
        message = MIMEMultipart()
        message["From"] = self.configs.email_from
        message["To"] = self.configs.email_to
        message["Subject"] = self.configs.email_subject

        body = f"""
        Se ha recibido un nuevo registro:

        Nombre Completo: {form_data.nombre_completo}
        Cédula: {form_data.cedula}
        Convenio: {form_data.convenio}
        Teléfono: {form_data.telefono}
        Fecha de Nacimiento: {form_data.fecha_nacimiento.strftime('%Y-%m-%d')}
        """

        message.attach(MIMEText(body, "plain"))

        try:
            await aiosmtplib.send(
                message,
                hostname=self.configs.email_smtp_server,
                port=self.configs.email_smtp_port,
                start_tls=True,
                username=self.configs.email_username,
                password=self.configs.email_password,
            )
            return True
        except Exception:
            return False

    async def submit_form(self, form_data: FormData) -> Tuple[bool, str, Dict[str, Any]]:
        if not form_data.politica_privacidad:
            return False, "Debe aceptar la política de privacidad.", {}

        try:
            if isinstance(form_data.fecha_nacimiento, date):
                form_data.fecha_nacimiento = datetime.combine(
                    form_data.fecha_nacimiento,
                    datetime.min.time()
                )

            data = form_data.dict()
            inserted_id = await self.form_repository.insert_form_submission(data)

            if not inserted_id:
                return False, "Error al guardar los datos en la base de datos.", {}

            str_id = str(inserted_id)
            email_sent = await self._send_email_notification(form_data)

            return True, "Formulario enviado exitosamente", {
                "inserted_id": str_id,
                "email_sent": email_sent
            }

        except Exception as e:
            return False, f"Error al procesar el formulario: {str(e)}", {}

    async def get_form_submission(self, submission_id: str) -> Tuple[bool, str, Dict[str, Any]]:
        try:
            if isinstance(submission_id, str):
                obj_id = ObjectId(submission_id)
            else:
                obj_id = submission_id

            document = await self.form_repository.get_form_submission(obj_id)
            if not document:
                return False, "Formulario no encontrado", {}

            if document and '_id' in document:
                document['_id'] = str(document['_id'])

            return True, "Formulario recuperado exitosamente", document
        except Exception as e:
            return False, f"Error al recuperar el formulario: {str(e)}", {}