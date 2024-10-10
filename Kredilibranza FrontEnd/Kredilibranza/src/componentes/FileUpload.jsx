import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, File, Upload } from 'lucide-react';
import Button from './Button';
import './FileUpload.css'; // Importa la hoja de estilos CSS

export default function FileUpload() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    URL.revokeObjectURL(file.preview); // Limpieza del objeto URL
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
              {files.map((file) => (
                <li key={file.name} className="uploaded-file-item">
                  <div className="file-info">
                    <File className="text-blue-500 mr-3" size={24} />
                    <span className="file-name">{file.name}</span>
                  </div>
                  <Button
                    onClick={() => removeFile(file)}
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
