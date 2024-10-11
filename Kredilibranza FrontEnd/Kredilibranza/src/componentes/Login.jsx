import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import { User, Lock, X } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciar sesión con:', username, password);
  };

  // Manejador del botón de cerrar para redirigir a la página principal
  const handleClose = () => {
    navigate('/'); // Redirige a la página principal cuando se haga clic en el botón X
  };

  return (
    <div className="login-container">
      {/* Formulario de Login */}
      <div className="login-card">
        {/* Botón de Cerrar dentro del formulario */}
        <button
          className="close-button"
          aria-label="Cerrar"
          onClick={handleClose} // Llama a `handleClose` para cerrar el login
        >
          <X size={24} /> {/* Asegúrate de que `X` esté bien importado */}
        </button>

        {/* Título del Formulario */}
        <h1 className="text-3xl font-bold text-center mb-8">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <div className="relative">
              <User className="icon" size={20} />
              <Input
                id="username"
                type="text"
                placeholder="tu_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="login-field">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="icon" size={20} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
