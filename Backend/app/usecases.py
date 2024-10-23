from app.core.models import Document
from app.core import ports

from app.core.ports import FormRepositoryPort
from app.core.schemas import FormData
from datetime import datetime, date


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


class FormSubmissionService:
    def __init__(self, form_repository: FormRepositoryPort):
        self.form_repository = form_repository

    async def submit_form(self, form_data: FormData) -> str:
        if isinstance(form_data.fecha_nacimiento, date):
            form_data.fecha_nacimiento = datetime.combine(form_data.fecha_nacimiento, datetime.min.time())
        data = form_data.dict()
        inserted_id = await self.form_repository.insert_form_submission(data)
        return inserted_id