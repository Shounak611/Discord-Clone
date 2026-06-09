import user from '../../assets/userIcon.png';
import plus from '../../assets/plusIcon.png';
import './css/LeftMid.css';
import discord from '../../assets/displayDiscordlogo.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import Displayname from './Displayname';

export default function LeftMid({ onSelectedOption, selectedOption }) {
    const [friends, setfriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const email = localStorage.getItem("email");
                if (email) {
                    const response = await axios.get(`${API_URL}friend/get-friends?email=${email}`);
                    setfriends(response.data);
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className="LeftMidC">
            <div className="leftMidScrollable">
                {/* <div className='leftMidheader'>
                    <div className='headerSearch'>
                        <div className="searchInner">
                            <svg className="searchIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <span className="searchText">Find or start a conversation</span>
                        </div>
                        <kbd className="searchShortcut">Ctrl+K</kbd>
                    </div>
                </div> */}
                <div className="opts">
                    <div
                        className={`opt ${selectedOption === "Friends" ? "active" : ""}`}
                        onClick={() => onSelectedOption("Friends")}
                    >
                        <img className='leftMidIcons' src={user} alt="userIcon" /><p>Friends</p>
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
                            friends.map((friend, index) => {
                                const isSelected = selectedOption === `Chat:${friend.username}`;
                                return (
                                    <div
                                        key={index}
                                        className={`dmFriend ${isSelected ? "active" : ""}`}
                                        onClick={() => onSelectedOption(`Chat:${friend.username}`)}
                                    >
                                        <div className="dmAvatarWrapper">
                                            <img className='dmAvatarIcon' src={discord} alt="discordLogo" />
                                            <span
                                                className="dmOnlineStatus"
                                                style={{ backgroundColor: friend.status === 'online' ? '#23a55a' : '#80848e' }}
                                            ></span>
                                        </div>
                                        <p>{friend.display_name || friend.username}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="leftMidUserProfile">
                <Displayname />
            </div>
        </div>
    )
}
