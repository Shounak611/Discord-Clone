import { useState } from 'react';
import './css/LeftFriends.css';
import axios from 'axios';

export default function LeftFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setStatusMessage({ text: "Please enter a username first.", isError: true });
            return;
        }
        const senderEmail = localStorage.getItem("email");

        try {
            await axios.post('http://localhost:8000/friend/send-request', {
                sender_email: senderEmail,
                receiver_username: searchQuery.trim(),
            });
            setStatusMessage({ text: "Friend request sent successfully!", isError: false });
            setSearchQuery('');
        } catch (err) {
            console.error(err);
            setStatusMessage({ 
                text: err.response?.data?.detail || "Failed to send friend request. Check the username.", 
                isError: true 
            });
        }
    };

    return (
        <div className='leftFriendsC'>
            <div className='leftFriendsUpper'>
                <h3>Add Friend</h3>
                <p>You can add friends with their Discord username. It's case-sensitive!</p>
                <div className="inputWithButton">
                    <input
                        type="text"
                        placeholder="Enter a Username#0000"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>Send Friend Request</button>
                </div>
                {statusMessage.text && (
                    <div className={`statusMsg ${statusMessage.isError ? 'error' : 'success'}`}>
                        {statusMessage.text}
                    </div>
                )}
            </div>

            <div className='leftFriendsLower'>
                <div className='wumpusIllustrationContainer'>
                    <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="wumpusIllustration">
                        {/* Background soft glow rings */}
                        <circle cx="110" cy="90" r="70" stroke="rgba(88, 101, 242, 0.05)" strokeWidth="1.5" strokeDasharray="4 4" />
                        <circle cx="110" cy="90" r="50" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1.2" />
                        <circle cx="110" cy="90" r="30" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 14" />
                        
                        {/* Floating robot head */}
                        <g className="floatingAnim">
                            {/* Antenna */}
                            <rect x="108" y="30" width="4" height="14" rx="2" fill="#5865f2" />
                            <circle cx="110" cy="27" r="4.5" fill="#8b5cf6" className="antennaGlow" />
                            
                            {/* Ears/Side bolts */}
                            <rect x="73" y="58" width="7" height="16" rx="3" fill="#8b5cf6" />
                            <rect x="140" y="58" width="7" height="16" rx="3" fill="#8b5cf6" />
                            
                            {/* Head Base */}
                            <rect x="80" y="44" width="60" height="44" rx="15" fill="url(#botGradient)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
                            
                            {/* Screen/Face */}
                            <rect x="86" y="50" width="48" height="30" rx="9" fill="#090a0f" />
                            
                            {/* Glowing Eyes */}
                            <circle cx="98" cy="65" r="3.5" fill="#06b6d4" className="blinkingEye" />
                            <circle cx="122" cy="65" r="3.5" fill="#06b6d4" className="blinkingEye" />
                            
                            {/* Smile */}
                            <path d="M104 72 Q110 76 116 72" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </g>
                        
                        {/* Definitions for gradients */}
                        <defs>
                            <linearGradient id="botGradient" x1="80" y1="44" x2="140" y2="88" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#5865f2" />
                                <stop offset="1" stopColor="#7c3aed" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <h4>Wumpus is waiting for friends!</h4>
                    <p>There are no friend requests active. Add a friend by typing their username above to get talking!</p>
                </div>
            </div>
        </div>
    );
}