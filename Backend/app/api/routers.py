import pydantic
from fastapi import APIRouter,Depends         , UploadFile, File , HTTPException
from pydantic import BaseModel
from app import usecases
from app.api import dependencies



from app.core.utils import extract_text_from_pdf, extract_text_from_docx


rag_router = APIRouter()

class DocumentInput(BaseModel):
    content: str = pydantic.Field(..., min_length=1)

class QueryInput(BaseModel):
    question: str = pydantic.Field(..., min_length=1)


@rag_router.post("/generate-answer/", status_code=200)
async def generate_answer(query_input: QueryInput,
                    rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    return {"answer": rag_service.generate_answer(query_input.question)}


@rag_router.post("/save-document/", status_code=201)
def save_document(document: DocumentInput,
                  rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    rag_service.save_document(content=document.content)
    return {"status": "Document saved successfully"}



@rag_router.post("/upload-pdf/", status_code=201)
async def upload_pdf(file: UploadFile = File(...),
                     rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")
    content = await file.read()
    text = extract_text_from_pdf(content)
    rag_service.save_document(content=text)
    return {"status": "PDF uploaded and content saved successfully"}


@rag_router.post("/upload-docx/", status_code=201)
async def upload_docx(file: UploadFile = File(...),
                      rag_service: usecases.RAGService = Depends(dependencies.RAGServiceSingleton.get_instance)):
    if file.content_type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        raise HTTPException(status_code=400, detail="El archivo debe ser un DOCX")
    content = await file.read()
    text = extract_text_from_docx(content)
    rag_service.save_document(content=text)
    return {"status": "DOCX uploaded and content saved successfully"}

