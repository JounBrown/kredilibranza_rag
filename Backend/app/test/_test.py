import pytest
from unittest.mock import MagicMock
from app.adapters.chromadb_adapter import ChromaDBAdapter

def test_delete_document():
    # Configuración del mock
    chroma_db_adapter = ChromaDBAdapter(10)
    chroma_db_adapter.collection = MagicMock()

    # Acción: eliminar un documento
    document_id = "doc_123"
    chroma_db_adapter.delete_document(document_id)

    # Comprobación
    chroma_db_adapter.collection.delete.assert_called_once_with(ids=[document_id])


import pytest
from unittest.mock import MagicMock
from app.usecases import DocumentService
from app.adapters.document_extractors import PDFTextExtractorAdapter, DocxTextExtractorAdapter


@pytest.fixture
def mock_pdf_extractor():
    return MagicMock(spec=PDFTextExtractorAdapter)


@pytest.fixture
def mock_docx_extractor():
    return MagicMock(spec=DocxTextExtractorAdapter)


def test_initialization(mock_pdf_extractor):
    service = DocumentService(mock_pdf_extractor)
    assert service.text_extractor == mock_pdf_extractor


def test_extract_text_pdf(mock_pdf_extractor):
    mock_pdf_extractor.extract_text.return_value = "Texto extraído del PDF"
    service = DocumentService(mock_pdf_extractor)

    # Simular la entrada del archivo PDF
    file_bytes = b"%PDF-1.4..."  # Bytes de un archivo PDF de prueba

    extracted_text = service.text_extractor.extract_text(file_bytes)

    assert extracted_text == "Texto extraído del PDF"


def test_extract_text_docx(mock_docx_extractor):
    mock_docx_extractor.extract_text.return_value = "Texto extraído del DOCX"
    service = DocumentService(mock_docx_extractor)

    # Simular la entrada del archivo DOCX
    file_bytes = b"PK\x03\x04..."  # Bytes de un archivo DOCX de prueba

    extracted_text = service.text_extractor.extract_text(file_bytes)

    assert extracted_text == "Texto extraído del DOCX"


