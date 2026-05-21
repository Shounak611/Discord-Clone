import './css/ChatLower.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function GroupChat({ serverId, channelId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const username = localStorage.getItem("user_name");
    const [mediaPreview, setMediaPreview] = useState(null);
    const userId = localStorage.getItem("user_id");

    const handleOpenMedia = (type, content) => {
        setMediaPreview({ type, content });
    };

    const handleCloseMedia = () => {
        setMediaPreview(null);
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/ws/${serverId}/${channelId}/messages`);
                setMessages(res.data); // Set past messages
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };

        fetchHistory();

        const encodedServerId = encodeURIComponent(serverId);
        const encodedChannelId = encodeURIComponent(channelId);
        const token = localStorage.getItem("token") || "";
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${encodedServerId}/${encodedChannelId}?token=${encodeURIComponent(token)}`);

        socketRef.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            setMessages((prev) => [...prev, msg]); // Add live message
        };

        return () => {
            ws.close();
        };
    }, [serverId, channelId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendTextMessage = () => {
        if (!input.trim()) return;
        const msg = {
            type: 'text',
            sender: username,
            content: input,
        };
        socketRef.current.send(JSON.stringify(msg));
        setInput('');
    };

    const sendFileMessage = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { url } = res.data;
            const fileType = file.type.startsWith('image') ? 'image' : 'video';

            const msg = {
                type: fileType,
                sender: username,
                content: url,
            };
            socketRef.current.send(JSON.stringify(msg));
            setFile(null);
        } catch (err) {
            console.error("Failed to upload file message", err);
        }
    };

    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/server/get_members/${serverId}`);
                setMembers(res.data);
            } catch (err) {
                console.error("Failed to fetch members", err);
            }
        };

        if (serverId) fetchMembers();
    }, [serverId]);

    const [owner, setOwner] = useState({});
    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/server/get_owner/${serverId}`);
                setOwner(res.data);
            } catch (err) {
                console.error("Failed to fetch owner", err);
            }
        };
        if (serverId) fetchOwner();
    }, [serverId]);

    const handleEditRole = async (memberId, currentRole) => {
        const newRole = prompt(`Edit role for member (current: ${currentRole}):`);
        if (!newRole || !newRole.trim()) return;

        try {
            const res = await axios.put(`http://localhost:8000/server/update_role`, {
                member_id: memberId,
                new_role: newRole,
                server_id: serverId,
            });

            setMembers(prev =>
                prev.map(m => (m.id === memberId ? { ...m, role: res.data.role } : m))
            );
        } catch (err) {
            console.error("Error updating role", err);
        }
    };

    return (
        <div className="ChatLowerC">
            <div className="ChatLeft">
                <div className="messagesArea">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`messageBubble ${msg.sender === localStorage.getItem("user_name") ? 'my-msg' : 'their-msg'}`}
                        >
                            <div>
                                <p><strong>{msg.sender}</strong></p>
                                {msg.type === 'text' && <p>{msg.content}</p>}
                                {msg.type === 'image' && (
                                    <img
                                        src={msg.content}
                                        alt="img"
                                        style={{ maxWidth: '250px', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => handleOpenMedia('image', msg.content)}
                                    />
                                )}
                                {msg.type === 'video' && (
                                    <video
                                        src={msg.content}
                                        controls
                                        style={{ maxWidth: '250px', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => handleOpenMedia('video', msg.content)}
                                    />
                                )}
                            </div>
                            <span className="timestamp">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                    {mediaPreview && (
                        <div className="media-overlay">
                            <span className="media-close" onClick={handleCloseMedia}>&times;</span>
                            {mediaPreview.type === 'image' ? (
                                <img src={mediaPreview.content} alt="full-preview" className="media-full" />
                            ) : (
                                <video src={mediaPreview.content} className="media-full" controls autoPlay />
                            )}
                        </div>
                    )}
                </div>

                <div className="inputArea">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message #${channelId}`}
                        onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
                    />

                    <div className="fileInputWrapper">
                        <span className="fileLabel">📎</span>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <button onClick={sendTextMessage}>Send</button>
                    <button onClick={sendFileMessage}>Upload</button>
                </div>
            </div>

            <div className="ChatRight">
                <h3>Channel: #{channelId}</h3>
                <h3>Owner : {owner.username}</h3>
                <p>Server: {serverId}</p>
                {file && (
                    <div className="filePreview">
                        <h1>file preview</h1>
                        {file.type.startsWith("image") ? (
                            <img src={URL.createObjectURL(file)} alt="preview" />
                        ) : file.type.startsWith("video") ? (
                            <video src={URL.createObjectURL(file)} controls />
                        ) : (
                            <p>{file.name}</p>
                        )}
                        <button className="removeFile" onClick={() => setFile(null)}>✖</button>
                    </div>
                )}
                <div className="memberList">
                    <h4>Server Members</h4>
                    {members.map(member => (
                        <li className='member' key={member.id}>
                            {member.username}&nbsp;
                            {member.role && <span>({member.role})</span>}
                            {owner.id == userId && <button
                                onClick={() => handleEditRole(member.id, member.role)}
                            >
                                ✎ Edit
                            </button>}
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
}
