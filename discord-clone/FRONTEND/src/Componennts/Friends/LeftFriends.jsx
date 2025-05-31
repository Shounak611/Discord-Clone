import { useState } from 'react';
import cartoon from '../../assets/inpCartoon.svg'
import './css/LeftFriends.css'
import axios from 'axios';

export default function LeftFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const senderEmail = localStorage.getItem("email");

        try {
            const response = await axios.get(`http://localhost:8000/search-friend?name=${encodeURIComponent(searchQuery)}`);
            const data = response.data;

            const sendReq = await axios.post('http://localhost:8000/friend/send-request', {
                sender_email: senderEmail,
                receiver_username: data.username,
            });

            alert("Friend request sent successfully!");
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response?.data?.detail || err.message}`);
            setError(err.message);
        }
    };


    return (
        <div className='leftFriendsC'>
            <div className='leftFriendsUpper'>
                <h3>Add Friend</h3>
                <p>You can add friends with their Discord username.</p>
                <div className="inputWithButton">
                    <input
                        type="text"
                        placeholder="You can add friends with their Discord username."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Send Friend Request</button>
                </div>

            </div>
            <div className='leftFriendsLower'></div>
        </div>
    )
}