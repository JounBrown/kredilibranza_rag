
from io import BytesIO
from PyPDF2 import PdfReader
from docx import Document as DocxDocument

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    pdf_reader = PdfReader(BytesIO(pdf_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(docx_bytes: bytes) -> str:
    docx_file = BytesIO(docx_bytes)
    document = DocxDocument(docx_file)
    text = ""
    for para in document.paragraphs:
        text += para.text + "\n"
    return text
