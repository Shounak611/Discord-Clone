import './css/Chat.css';
import ChatNav from '../Chat/ChatNav';
import ChatLower from '../Chat/ChatLower';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat({ frndName, onToggleSidebar, onInitiateCall }) {
    const senderEmail = localStorage.getItem("email");
    const userId = localStorage.getItem("user_id");
    const [messages, setMessages] = useState([]);

    // Fetch conversation
    const fetchConversation = async () => {
        if (!senderEmail || !frndName) return;
        try {
            const response = await axios.get(`http://localhost:8000/chat/get_msgs/${frndName}/${senderEmail}`);
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching conversation in Chat.jsx:", err);
        }
    };

    // WebSocket connection for real-time messages
    useEffect(() => {
        fetchConversation();

        const token = localStorage.getItem("token") || "";
        const encodedFrndName = encodeURIComponent(frndName);
        const ws = new WebSocket(`ws://localhost:8000/chat/ws/${encodedFrndName}?token=${encodeURIComponent(token)}`);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            
            // Bypass WebRTC signaling messages
            if (msg.type === "rtc_signal") {
                return;
            }
            
            setMessages((prev) => {
                if (prev.some(m => m.id === msg.id)) {
                    return prev;
                }
                return [...prev, msg];
            });
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, [frndName, senderEmail]);

    // Replace raw signal codes with human readable system log lines
    const displayMessages = messages.map(msg => {
        if (msg.content.startsWith("__CALL_INITIATED__:audio")) {
            return {
                ...msg,
                isSystem: true,
                content: msg.sender_id == userId ? "📞 You started a voice call." : "📞 Incoming voice call."
            };
        }
        if (msg.content.startsWith("__CALL_INITIATED__:video")) {
            return {
                ...msg,
                isSystem: true,
                content: msg.sender_id == userId ? "📹 You started a video call." : "📹 Incoming video call."
            };
        }
        if (msg.content.startsWith("__CALL_ACCEPTED__:")) {
            return { ...msg, isSystem: true, content: "🤝 Call connected." };
        }
        if (msg.content.startsWith("__CALL_DECLINED__:")) {
            return { ...msg, isSystem: true, content: "❌ Call declined." };
        }
        if (msg.content.startsWith("__CALL_HUNGUP__:")) {
            return { ...msg, isSystem: true, content: "⏹️ Call ended." };
        }
        return msg;
    });

    return (
        <div className="chatC">
            <ChatNav 
                frndName={frndName} 
                onInitiateCall={(type) => onInitiateCall(type, frndName)} 
                onToggleSidebar={onToggleSidebar} 
            />
            
            <ChatLower 
                frndName={frndName} 
                messages={displayMessages} 
                onSendMessage={fetchConversation} 
            />
        </div>
    );
}