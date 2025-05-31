import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SentRequests() {
    const [sentRequests, setSentRequests] = useState([]);
    const currentUserEmail = localStorage.getItem("email");

    useEffect(() => {
        axios.get(`http://localhost:8000/friend/sent-requests/${currentUserEmail}`)
            .then(res => setSentRequests(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='leftFriendsC'>
            <h3>Sent Friend Requests</h3>
            {sentRequests.map((user, i) => (
                <div key={i} className="friendRequestCard">
                    <p>{user.username} ({user.email})</p>
                </div>
            ))}
        </div>
    );
}
