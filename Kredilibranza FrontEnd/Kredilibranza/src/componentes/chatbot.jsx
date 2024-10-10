import React, { useState } from 'react';
import './chatbot.css';

function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    const userMessage = { role: 'user', content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    const botResponse = await getBotResponse(inputValue);
    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const getBotResponse = async ( message)=>{
    try {
      const response = await fetch(`http://localhost:8000/generate-answer/`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',},
        body: JSON.stringify({question:message}),
      });
      
      const data = await response.json();
      return { role: 'bot', content: data.answer }; // Ajusta según la estructura de la respuesta
    } catch (error) {
      console.error('Error al obtener respuesta del bot:', error);
      return { role: 'bot', content: 'Error al obtener respuesta del bot.' };
    }
  };


  return (
    <div className="chat-container">
      <h1>ChatBot Kredilibranza</h1>
      <div className="chat-window">
        {}
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>

        {}
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;
