import './css/ChatLower.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChatLower({ frndName }) {
    const receiver_username = frndName;
    const sender_email = localStorage.getItem("email");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (sender_email && receiver_username) {
            fetchConversation();
        }
    }, [receiver_username]);

    const fetchConversation = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/chat/get_msgs/${receiver_username}/${sender_email}`);
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching conversation:", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            await axios.post(`http://localhost:8000/chat/send`, {
                sender_email,
                receiver_username,
                content: input
            });
            setInput("");
            fetchConversation();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className="ChatLowerC">
            <div className="ChatLeft">
                <div className="messagesArea">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`messageBubble ${msg.sender_id === msg.receiver_id ? 'my-msg' : 'their-msg'}`}
                        >
                            <p>{msg.content}</p>
                            <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="inputArea">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
            <div className="ChatRight">
                <h3>Chatting with: {receiver_username}</h3>
            </div>
        </div>
    )
}
