import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="floating-chatbot" onClick={toggleChatBot}>
        <div className="sphere"></div>
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <ChatWindow />
          <button className="close-button" onClick={toggleChatBot}>×</button>
        </div>
      )}
    </>
  );
}

export default FloatingChatBot;