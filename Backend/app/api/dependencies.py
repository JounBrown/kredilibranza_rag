from app.adapters.openai_adapter import OpenAIAdapter
from app.adapters.chromadb_adapter import ChromaDBAdapter
from app import usecases
from app import configurations

from app.adapters.mongodb_adapter import MongoDBAdapter
from app.usecases import FormSubmissionService


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


class FormServiceSingleton:
    _instance = None

    @classmethod
    def get_instance(cls) -> FormSubmissionService:
        if cls._instance is None:
            form_repository = MongoDBAdapter()
            cls._instance = FormSubmissionService(form_repository=form_repository)
        return cls._instance
