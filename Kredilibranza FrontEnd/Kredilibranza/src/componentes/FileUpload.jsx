import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, File, Upload } from 'lucide-react';
import Button from './Button';
import './FileUpload.css'; 
import axios from 'axios';

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  // Función reutilizable para cargar archivos
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = 'http://localhost:8000/upload-file/';
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Aquí nos aseguramos de que `documentId` se establezca correctamente
      const documentId = response.data.inserted_id;  // Cambié `id` por `inserted_id` para concordar con la respuesta del backend
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          file,
          preview: URL.createObjectURL(file),
          id: documentId,  // Aseguramos que el ID se almacene correctamente
        },
      ]);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setError('Error al subir el archivo.');
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        uploadFile(file);
      } else {
        setError('Tipo de archivo no soportado');
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = async (fileObj) => {
    if (!fileObj.id) {
      setError('Error: No se puede eliminar el archivo porque falta el ID');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/delete-document/${fileObj.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const newFiles = files.filter((f) => f.id !== fileObj.id);
      setFiles(newFiles);
      URL.revokeObjectURL(fileObj.preview);
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      setError('Error al eliminar el archivo.');
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        <h1 className="text-3xl font-bold text-center mb-8">Carga de Documentos</h1>
        
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          {isDragActive ? (
            <p className="text-lg text-blue-500">Suelta los archivos aquí ...</p>
          ) : (
            <p className="text-lg text-gray-500">Arrastra y suelta archivos PDF o DOCX aquí, o haz clic para seleccionar archivos</p>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {files.length > 0 && (
          <div className="uploaded-files-list">
            <h2 className="text-2xl font-semibold mb-4">Documentos Cargados</h2>
            <ul>
              {files.map((fileObj) => (
                <li key={fileObj.id} className="uploaded-file-item">
                  <div className="file-info">
                    <File className="text-blue-500 mr-3" size={24} />
                    <span className="file-name">{fileObj.file.name}</span>
                  </div>
                  <Button
                    onClick={() => removeFile(fileObj)}
                    className="remove-button flex items-center"
                  >
                    <X size={20} />
                    <span className="sr-only">Eliminar archivo</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
