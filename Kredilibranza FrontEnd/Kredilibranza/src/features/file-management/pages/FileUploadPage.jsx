import React, { useState } from 'react';
import FileUploadForm from '../components/FileUploadForm';
import RequestsModal from '../components/RequestsModal';
import '../styles/FileUpload.css';

export default function FileUploadPage() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        <h1 className="text-3xl font-bold text-center mb-8">Carga de Documentos</h1>
        
        <button
          onClick={() => setShowRequestsModal(true)}
          className="view-requests-button"
        >
          Ver solicitudes
        </button>

        <FileUploadForm 
          files={files}
          setFiles={setFiles}
          error={error}
          setError={setError}
        />

        <RequestsModal 
          showModal={showRequestsModal}
          setShowModal={setShowRequestsModal}
        />
      </div>
    </div>
  );
}