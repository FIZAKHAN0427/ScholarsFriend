import React, { useState, useRef } from 'react';
import './chatbot.css';
import chatIcon from './images/chatbox-icon.svg'; // Adjust path as needed


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messageContainerRef = useRef(null);

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSendMessage = async () => {
        const trimmedMessage = input.trim();
        if (trimmedMessage === "") return;

        const userMessage = { name: 'User', message: trimmedMessage };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput("");

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: JSON.stringify({ message: trimmedMessage }),
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            const botMessage = { name: 'Sam', message: data.answer };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { name: 'Sam', message: "Sorry, I couldn't process that." };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }

        // Scroll to the bottom of the messages
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="container">
            <div className={`chatbox ${isOpen ? 'chatbox--active' : ''}`}>
                <div className="chatbox__support">
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="Profile" />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Scholar AI</h4>
                            <p className="chatbox__description--header">Hi, my name is Sam. How can I help you?</p>
                        </div>
                    </div>
                    <div className="chatbox__messages" ref={messageContainerRef}>
                        <div>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`messages__item ${message.name === "Sam" ? 'messages__item--visitor' : 'messages__item--operator'}`}
                                >
                                    {message.message}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chatbox__footer">
                        <input
                            type="text"
                            placeholder="Write a message..."
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="chatbox__send--footer send__button" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
                <div className="chatbox__button">
                    <button onClick={toggleChatbox}>
                        <img src={chatIcon} alt="Chat icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
