import React, { useEffect, useState } from 'react';
import axios from 'axios';
import discord from '../../assets/displayDiscordlogo.png';
import './css/PendingRequests.css';

export default function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const currentUserEmail = localStorage.getItem("email");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = () => {
        axios.get(`http://localhost:8000/friend/pending-requests/${currentUserEmail}`)
            .then(res => setPendingRequests(res.data))
            .catch(err => console.log(err));
    };

    const handleAccept = async (senderEmail) => {
        try {
            await axios.put('http://localhost:8000/friend/accept-request', {
                sender_email: senderEmail,
                receiver_email: currentUserEmail
            });
            fetchPendingRequests();
            window.location.reload()
        } catch (err) {
            console.error(err);
            alert("Failed to accept request.");
        }
    };

    const handleReject = async (senderEmail) => {
        try {
            await axios.delete('http://localhost:8000/friend/reject-request', {
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
            {pendingRequests.map((user, i) => (
                <div key={i} className="friendRequestCard">
                    <div className='friendRequestCardL'>
                        <img className='iconsize' src={discord} alt="discordLogo" />
                        <p>{user.username}</p>
                    </div>
                    <div className='friendRequestCardR'>
                        <button onClick={() => handleAccept(user.email)}>Accept</button>
                        <button id='danger' onClick={() => handleReject(user.email)}>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
