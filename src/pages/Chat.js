import React, { useState, useEffect } from 'react';
import './Chat.css';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

function Chat() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const currentUser = "LoggedInUser"; // Placeholder for logged-in user information

  useEffect(() => {
    socket.on('typing', () => setTyping(true));
    socket.on('stopTyping', () => setTyping(false));
  }, []);

  const handleSendMessage = () => {
    const message = { text: newMessage, sender: currentUser }; // Use logged-in user info
    setMessages([...messages, message]);
    socket.emit('stopTyping');
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      {typing && <p>Someone is typing...</p>}
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message here..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            socket.emit('typing');
          }}
        />
        <button onClick={handleSendMessage}>✈</button>
      </div>
    </div>
  );
}

export default Chat;
