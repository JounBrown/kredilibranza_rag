from io import BytesIO
from PyPDF2 import PdfReader
from docx import Document as DocxDocument
from app.core.ports import DocumentTextExtractorPort

# Adaptador para la extracción de texto desde PDFs
class PDFTextExtractorAdapter(DocumentTextExtractorPort):
    def extract_text(self, file_bytes: bytes) -> str:
        pdf_reader = PdfReader(BytesIO(file_bytes))
        text = "".join(page.extract_text() for page in pdf_reader.pages)
        return text

# Adaptador para la extracción de texto desde DOCX
class DocxTextExtractorAdapter(DocumentTextExtractorPort):
    def extract_text(self, file_bytes: bytes) -> str:
        docx_file = BytesIO(file_bytes)
        document = DocxDocument(docx_file)
        text = "\n".join(para.text for para in document.paragraphs)
        return text
