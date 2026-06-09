import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import discord from '../../assets/displayDiscordlogo.png';
import './css/PendingRequests.css';

export default function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const currentUserEmail = localStorage.getItem("email");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = () => {
        axios.get(`${API_URL}friend/pending-requests/${currentUserEmail}`)
            .then(res => setPendingRequests(res.data))
            .catch(err => console.log(err));
    };

    const handleAccept = async (senderEmail) => {
        try {
            await axios.put(`${API_URL}friend/accept-request`, {
                sender_email: senderEmail,
                receiver_email: currentUserEmail
            });
            fetchPendingRequests();
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to accept request.");
        }
    };

    const handleReject = async (senderEmail) => {
        try {
            await axios.delete(`${API_URL}friend/reject-request`, {
                sender_email: senderEmail,
                receiver_email: currentUserEmail
            });
            fetchPendingRequests(); 
        } catch (err) {
            console.error(err);
            alert("Failed to reject request.");
        }
    };

    return (
        <div className='leftFriendsC'>
            <h3>Pending Friend Requests</h3>
            
            {pendingRequests.length === 0 ? (
                <div className='pendingEmptyState'>
                    <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="pendingIllustration">
                        <circle cx="100" cy="75" r="55" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" />
                        <circle cx="100" cy="75" r="40" stroke="rgba(88, 101, 242, 0.06)" strokeWidth="1.5" />
                        
                        {/* Floating Envelope */}
                        <g className="floatingAnim">
                            {/* Glow behind envelope */}
                            <rect x="70" y="50" width="60" height="42" rx="8" fill="rgba(88, 101, 242, 0.15)" filter="blur(6px)" />
                            
                            {/* Envelope body */}
                            <rect x="72" y="52" width="56" height="38" rx="6" fill="#1e2030" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
                            
                            {/* Letter contents peeking out */}
                            <path d="M78 52 V46 H122 V52" fill="#5865f2" opacity="0.8" />
                            
                            {/* Folding flap lines */}
                            <path d="M72 54 L100 74 L128 54" stroke="#5865f2" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M72 88 L92 70" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
                            <path d="M128 88 L108 70" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
                            
                            {/* Sparkles */}
                            <circle cx="60" cy="45" r="2.5" fill="#eab308" />
                            <circle cx="142" cy="65" r="1.5" fill="#06b6d4" />
                            <circle cx="134" cy="95" r="2" fill="#8b5cf6" />
                        </g>
                    </svg>
                    <h4>All quiet on the request front!</h4>
                    <p>When you receive friend requests or send them, they will appear here until you accept or reject them.</p>
                </div>
            ) : (
                <div className="pendingRequestsList">
                    {pendingRequests.map((user, i) => (
                        <div key={i} className="friendRequestCard">
                            <div className='friendRequestCardL'>
                                <div className="dmAvatarWrapper">
                                    <img className="dmAvatarIcon" src={discord} alt="discordLogo" />
                                </div>
                                <div className='friendRequestMeta'>
                                    <span className='friendRequestUsername'>{user.username}</span>
                                    <span className='friendRequestSubtitle'>Incoming Friend Request</span>
                                </div>
                            </div>
                            <div className='friendRequestCardR'>
                                <button className='btnAccept' onClick={() => handleAccept(user.email)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Accept
                                </button>
                                <button className='btnReject' onClick={() => handleReject(user.email)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
