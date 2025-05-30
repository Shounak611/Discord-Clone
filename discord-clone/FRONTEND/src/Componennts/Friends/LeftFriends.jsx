import { useState } from 'react';
import cartoon from '../../assets/inpCartoon.svg'
import './css/LeftFriends.css'

export default function LeftFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const response = await fetch(`http://localhost:8000/search-friend?name=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('Friend not found');
            const data = await response.json();
            alert(`User found: ${data.username} (${data.display_name})`);
        } catch (err) {
            alert(`Error:${err.message}`)
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