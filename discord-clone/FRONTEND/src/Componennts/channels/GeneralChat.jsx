import './css/ChatLower.css';
import { useEffect, useRef, useState } from 'react';

export default function GroupChat({ serverId, channelId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const username = localStorage.getItem("user_name");
    const [mediaPreview, setMediaPreview] = useState(null);

    const handleOpenMedia = (type, content) => {
        setMediaPreview({ type, content });
    };

    const handleCloseMedia = () => {
        setMediaPreview(null);
    };
    useEffect(() => {
        const fetchHistory = async () => {
            const res = await fetch(`http://localhost:8000/ws/${serverId}/${channelId}/messages`);
            const history = await res.json();
            setMessages(history); // Set past messages
        };

        fetchHistory();

        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${serverId}/${channelId}`);
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

        const res = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData,
        });

        const { url } = await res.json();
        const fileType = file.type.startsWith('image') ? 'image' : 'video';

        const msg = {
            type: fileType,
            sender: username,
            content: url,
        };
        socketRef.current.send(JSON.stringify(msg));
        setFile(null);
    };
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch(`http://localhost:8000/server/get_members/${serverId}`);
                const data = await res.json();
                setMembers(data);
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
                const res = await fetch(`http://localhost:8000/server/get_owner/${serverId}`)
                const data = await res.json();
                setOwner(data);
            } catch {
                console.error("Failed to fetch owner", err);
            }
        }
        if (serverId) fetchOwner();
    }, [serverId]);

    const handleEditRole = async (memberId, currentRole) => {
        const newRole = prompt(`Edit role for member (current: ${currentRole}):`);
        if (!newRole.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/server/update_role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    member_id: memberId,
                    new_role: newRole,
                    server_id: serverId,
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setMembers(prev =>
                    prev.map(m => (m.id === memberId ? { ...m, role: updated.role } : m))
                );
            } else {
                console.error("Failed to update role");
            }
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
                        <span className="fileLabel">📎</span> {/* You can use "Choose", 📁, etc. */}
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
                            <button
                                onClick={() => handleEditRole(member.id, member.role)}
                            >
                                ✎ Edit
                            </button>
                        </li>
                    ))}

                </div>
            </div>
        </div>
    );
}
