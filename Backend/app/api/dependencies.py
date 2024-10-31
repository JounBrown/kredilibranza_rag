from app.adapters.openai_adapter import OpenAIAdapter
from app.adapters.chromadb_adapter import ChromaDBAdapter
from app import usecases
from app import configurations
from app.adapters.document_extractors import PDFTextExtractorAdapter, DocxTextExtractorAdapter
from app.usecases import DocumentService
from fastapi import UploadFile, HTTPException
from app.adapters.mongodb_adapter import MongoDBAdapter
from app.adapters.mongodb_user_adapter import MongoDBUserAdapter
from app.usecases import FormSubmissionService
from app.configurations import Configs
from fastapi.security import OAuth2PasswordBearer
from app.usecases import FormSubmissionService, AuthService
from app.core.models import User


# OAuth2 scheme para autenticación
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

class RAGServiceSingleton:
    _instance = None

    @classmethod
    def get_instance(cls) -> usecases.RAGService:
        if cls._instance is None:
            configs = configurations.Configs()
            openai_adapter = OpenAIAdapter(api_key=configs.openai_api_key, model=configs.model,
                                           max_tokens=configs.max_tokens, temperature=configs.temperature)
            document_repo = ChromaDBAdapter(number_of_vectorial_results=configs.number_of_vectorial_results)
            cls._instance = usecases.RAGService(document_repo=document_repo, openai_adapter=openai_adapter)
        return cls._instance

class MongoDBAdapterSingleton:
    _instance = None

    @classmethod
    def get_instance(cls) -> MongoDBAdapter:
        if cls._instance is None:
            cls._instance = MongoDBAdapter()
        return cls._instance
    
    
class FormServiceSingleton:
    _instance = None

    @classmethod
    def get_instance(cls) -> FormSubmissionService:
        if cls._instance is None:
            cls._configs = Configs()
            form_repository = MongoDBAdapterSingleton.get_instance()
            cls._instance = FormSubmissionService(
                form_repository=form_repository,
                configs=cls._configs
            )
        return cls._instance


    
class AuthServiceSingleton:
    _instance = None
    @classmethod
    def get_instance(cls) -> AuthService:
        if cls._instance is None:
            user_repo = MongoDBUserAdapter()
            cls._instance = AuthService(user_repo=user_repo)
        return cls._instance
    
def get_document_service(file: UploadFile) -> DocumentService:
    if file.content_type == 'application/pdf':
        text_extractor = PDFTextExtractorAdapter()  # Estrategia para PDF
    elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        text_extractor = DocxTextExtractorAdapter()  # Estrategia para DOCX
    else:
        raise HTTPException(status_code=400, detail="Formato de archivo no soportado")

    return DocumentService(text_extractor) 




