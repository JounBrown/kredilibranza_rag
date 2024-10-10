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
    const botResponse = await simulateBotResponse(inputValue);
    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const simulateBotResponse = async (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ role: 'bot', content: `Simulación de respuesta a: "${message}"` });
      }, 1000); 
    });
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
