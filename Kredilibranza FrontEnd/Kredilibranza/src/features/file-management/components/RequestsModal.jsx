import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RequestsModal({ showModal, setShowModal }) {
  const [requests, setRequests] = useState([]);
  const [searchCedula, setSearchCedula] = useState('');

  const fetchRequests = async (cedula = '') => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/get-requests/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          cedula: cedula || null,
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchRequests();
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showModal]);

  const handleSearchChange = (e) => {
    setSearchCedula(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests(searchCedula);
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Solicitudes Registradas</h2>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Buscar por cédula"
            value={searchCedula}
            onChange={handleSearchChange}
          />
          <button type="submit">Buscar</button>
        </form>

        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Cédula</th>
                <th>Convenio</th>
                <th>Teléfono</th>
                <th>Fecha de Nacimiento</th>
                <th>Política de Privacidad</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.nombre_completo}</td>
                  <td>{request.cedula}</td>
                  <td>{request.convenio}</td>
                  <td>{request.telefono}</td>
                  <td>{new Date(request.fecha_nacimiento).toLocaleDateString()}</td>
                  <td>{request.politica_privacidad ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setShowModal(false)}
          className="close-modal-button"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}