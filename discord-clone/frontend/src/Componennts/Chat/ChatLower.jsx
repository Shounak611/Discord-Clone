import './css/ChatLower.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatLower({ frndName, messages = [], onSendMessage }) {
    const receiver_username = frndName;
    const sender_email = localStorage.getItem("email");
    const user_id = localStorage.getItem("user_id");
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const messagesAreaRef = useRef(null);

    useEffect(() => {
        const container = messagesAreaRef.current;
        if (!container) return;
        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (isNearBottom) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            await axios.post(`http://localhost:8000/chat/send`, {
                sender_email,
                receiver_username,
                content: input
            });
            setInput("");
            if (onSendMessage) onSendMessage();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className="ChatLowerC">
            <div className="ChatLeft">
                <div className="messagesArea" ref={messagesAreaRef}>
                    {messages.map((msg) => {
                        if (msg.isSystem) {
                            return (
                                <div key={msg.id || msg.timestamp} className="systemMsgWrapper">
                                    <div className="systemMsgBubble">
                                        <p>{msg.content}</p>
                                        <span className="timestamp">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={msg.id}
                                className={`messageBubble ${msg.sender_id == user_id ? 'my-msg' : 'their-msg'}`}
                            >
                                <p>{msg.content}</p>
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
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
