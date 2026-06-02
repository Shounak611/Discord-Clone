import './css/Chat.css';
import ChatNav from '../Chat/ChatNav';
import ChatLower from '../Chat/ChatLower';
import OneToOneCall from '../Chat/OneToOneCall';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat({ frndName, onToggleSidebar }) {
    const senderEmail = localStorage.getItem("email");
    const userId = localStorage.getItem("user_id");
    const [messages, setMessages] = useState([]);
    const [activeCall, setActiveCall] = useState(null);

    const activeCallRef = useRef(activeCall);
    activeCallRef.current = activeCall;

    const wsRef = useRef(null);
    const rtcSignalHandlerRef = useRef(null);

    const processSignaling = (latestMsg) => {
        const content = latestMsg.content;
        const isFromFriend = latestMsg.sender_id != userId;
        
        if (content.startsWith("__CALL_INITIATED__:")) {
            const parts = content.split(":");
            const type = parts[1];
            const channelName = parts[2];
            
            const msgTime = new Date(latestMsg.timestamp).getTime();
            const isFresh = (Date.now() - msgTime) < 25000;

            if (isFresh) {
                if (isFromFriend && (!activeCallRef.current || activeCallRef.current.channelName !== channelName)) {
                    setActiveCall({ type, status: 'incoming', channelName, isCaller: false });
                } else if (!isFromFriend && !activeCallRef.current) {
                    setActiveCall({ type, status: 'offering', channelName, isCaller: true });
                }
            }
        } else if (content.startsWith("__CALL_ACCEPTED__:")) {
            const parts = content.split(":");
            const channelName = parts[2];
            if (activeCallRef.current && activeCallRef.current.channelName === channelName && activeCallRef.current.status !== 'connected') {
                setActiveCall(prev => ({ ...prev, status: 'connected' }));
            }
        } else if (content.startsWith("__CALL_DECLINED__:") || content.startsWith("__CALL_HUNGUP__:")) {
            const parts = content.split(":");
            const channelName = parts[2];
            if (activeCallRef.current && activeCallRef.current.channelName === channelName) {
                setActiveCall(null);
            }
        }
    };

    // Fetch conversation and check for call signaling
    const fetchConversation = async () => {
        if (!senderEmail || !frndName) return;
        try {
            const response = await axios.get(`http://localhost:8000/chat/get_msgs/${frndName}/${senderEmail}`);
            const fetchedMsgs = response.data;
            setMessages(fetchedMsgs);

            if (fetchedMsgs.length > 0) {
                const latestMsg = fetchedMsgs[fetchedMsgs.length - 1];
                processSignaling(latestMsg);
            }
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
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            
            // Intercept WebRTC signaling messages
            if (msg.type === "rtc_signal") {
                if (rtcSignalHandlerRef.current) {
                    rtcSignalHandlerRef.current(msg.signal);
                }
                return;
            }
            
            setMessages((prev) => {
                if (prev.some(m => m.id === msg.id)) {
                    return prev;
                }
                return [...prev, msg];
            });

            processSignaling(msg);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
            wsRef.current = null;
        };

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [frndName, senderEmail]);

    // Reset active call when switching chat partner
    useEffect(() => {
        setActiveCall(null);
    }, [frndName]);

    const sendSignalingMessage = async (content) => {
        try {
            await axios.post(`http://localhost:8000/chat/send`, {
                sender_email: senderEmail,
                receiver_username: frndName,
                content: content
            });
            fetchConversation();
        } catch (err) {
            console.error("Error sending signaling message:", err);
        }
    };

    const handleInitiateCall = (type) => {
        const senderPrefix = senderEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const receiverPrefix = frndName.replace(/[^a-zA-Z0-9]/g, '');
        // Sort names lexicographically to ensure both users compute the exact same channel room key!
        const channelName = `call_${[senderPrefix, receiverPrefix].sort().join('_')}`;
        
        sendSignalingMessage(`__CALL_INITIATED__:${type}:${channelName}`);
        setActiveCall({ type, status: 'offering', channelName, isCaller: true });
    };

    const sendRtcSignal = (signal) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: "rtc_signal",
                signal: signal
            }));
        }
    };

    const registerSignalHandler = (handler) => {
        rtcSignalHandlerRef.current = handler;
    };

    const handleAcceptCall = () => {
        if (!activeCall) return;
        sendSignalingMessage(`__CALL_ACCEPTED__:${activeCall.type}:${activeCall.channelName}`);
        setActiveCall(prev => ({ ...prev, status: 'connected' }));
    };

    const handleDeclineCall = () => {
        if (!activeCall) return;
        sendSignalingMessage(`__CALL_DECLINED__:${activeCall.type}:${activeCall.channelName}`);
        setActiveCall(null);
    };

    const handleHangUp = () => {
        if (!activeCall) return;
        sendSignalingMessage(`__CALL_HUNGUP__:${activeCall.type}:${activeCall.channelName}`);
        setActiveCall(null);
    };

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
            <ChatNav frndName={frndName} onInitiateCall={handleInitiateCall} onToggleSidebar={onToggleSidebar} />
            
            {/* Outgoing Calling Dialog */}
            {activeCall && activeCall.status === 'offering' && (
                <div className="callingOverlay">
                    <div className="callingCard">
                        <div className="avatarRing incomingPulse">
                            {frndName.charAt(0).toUpperCase()}
                        </div>
                        <h3>Calling {frndName}...</h3>
                        <p>Waiting for response</p>
                        <button className="declineBtn" onClick={handleHangUp} style={{ marginTop: '20px' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Incoming Call Dialog */}
            {activeCall && activeCall.status === 'incoming' && (
                <div className="callingOverlay">
                    <div className="callingCard">
                        <div className="avatarRing incomingPulse">
                            {frndName.charAt(0).toUpperCase()}
                        </div>
                        <h3>Incoming {activeCall.type === 'video' ? 'Video' : 'Voice'} Call</h3>
                        <p>from {frndName}</p>
                        <div className="incomingActions">
                            <button className="acceptBtn" onClick={handleAcceptCall}>Accept</button>
                            <button className="declineBtn" onClick={handleDeclineCall}>Decline</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Connected Call Screen */}
            {activeCall && activeCall.status === 'connected' && (
                <OneToOneCall 
                    channelName={activeCall.channelName} 
                    isVideo={activeCall.type === 'video'} 
                    friendName={frndName} 
                    onHangUp={handleHangUp} 
                    isCaller={activeCall.isCaller}
                    sendRtcSignal={sendRtcSignal}
                    registerSignalHandler={registerSignalHandler}
                />
            )}

            <ChatLower 
                frndName={frndName} 
                messages={displayMessages} 
                onSendMessage={fetchConversation} 
            />
        </div>
    );
}