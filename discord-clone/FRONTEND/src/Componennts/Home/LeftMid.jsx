import user from '../../assets/userIcon.png'
import nitro from '../../assets/nitroIcon.png'
import shop from '../../assets/shopIcon.png'
import plus from '../../assets/plusIcon.png'
import './css/LeftMid.css'
import discord from '../../assets/displayDiscordlogo.png'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function LeftMid({ onSelectedOption }) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const email = localStorage.getItem("email"); 
                const response = await axios.get(`http://localhost:8000/friend/get-friends?email=${email}`);
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className="LeftMidC">
            <div className='leftMidheader'>
                <div className='header'><p>Find or start a conversation</p></div>
            </div>
            <div className="opts">
                <div className="opt" onClick={() => onSelectedOption("Friends")}>
                    <img className='leftMidIcons' src={user} alt="userIcon" /><p>Friends</p>
                </div>
                <div className="opt" onClick={() => onSelectedOption("Nitro")}>
                    <img className='leftMidIcons' src={nitro} alt="nitroIcon" /><p>Nitro</p>
                </div>
                <div className="opt" onClick={() => onSelectedOption("Shop")}>
                    <img className='leftMidIcons' src={shop} alt="shopIcon" /><p>Shop</p>
                </div>
            </div>
            <div className="dm">
                <div className="dmheader">
                    <p>Direct Messages</p>
                    <img className='leftMidIcons' src={plus} alt="plusIcon" />
                </div>
                <div className="dmList">
                    {friends.length === 0 ? (
                        <p className="noDM">No friends to show</p>
                    ) : (
                        friends.map((friend, index) => (
                            <div key={index} className="dmFriend">
                                <img className='iconsize' src={discord} alt="discordLogo" />
                                <p>{friend}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
