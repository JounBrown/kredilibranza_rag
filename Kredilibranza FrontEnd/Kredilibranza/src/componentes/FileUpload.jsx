import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, File, Upload } from 'lucide-react';
import Button from './Button';
import './FileUpload.css'; // Importa la hoja de estilos CSS
import axios from 'axios';

export default function FileUpload() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async(file)=>{
      const formData = new FormData();
      formData.append('file', file);

      let uploadUrl = '';
      if (file.type === 'application/pdf') {
        uploadUrl = 'http://localhost:8000/upload-pdf/';
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        uploadUrl = 'http://localhost:8000/upload-docx/';
      } else {
        alert('Tipo de archivo no soportado');
        return;
      }
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        const documentId = response.data.id;
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            file,
            preview: URL.createObjectURL(file),
            id: documentId, // Guardamos el ID retornado por el backend
          },
        ]);
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      }

    });
  },[]); 


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = async (fileObj) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/delete-document/${fileObj.id}`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const newFiles = files.filter((f) => f.id !== fileObj.id);
      setFiles(newFiles);
      URL.revokeObjectURL(fileObj.preview); // Limpieza del objeto URL
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };

  return (
    <div className="file-upload-container"> {/* Contenedor principal centrado */}
      <div className="file-upload-card"> {/* Tarjeta principal */}
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
