import './css/Displayname.css'
import discord from '../../assets/displayDiscordlogo.png'
import headphone from '../../assets/headphoneIcon.png'
import mute from '../../assets/muteIcon.png'
import settings from '../../assets/settingsIcon.png'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_URL } from '../../config'
import ProfileSettingsModal from './ProfileSettingsModal'

export default function Displayname() {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}get_user?email=${encodeURIComponent(email)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsername(res.data.username);
                setDisplayName(res.data.display_name);
                localStorage.setItem("user_name", res.data.username);
                localStorage.setItem("user_id", res.data.id);
            } catch (error) {
                console.warn("Failed to fetch user info, using local defaults:", error);
                setUsername("shounak");
                setDisplayName("Shounak");
            }
        };

        if (email) {
            fetchUser();
        }
    }, [email]);

    const handleMuteToggle = () => {
        setIsMuted(prev => !prev);
    };

    const handleDeafenToggle = () => {
        setIsDeafened(prev => {
            const next = !prev;
            if (next) {
                setIsMuted(true);
            }
            return next;
        });
    };

    return (
        <>
            <div className='displaynameC'>
                <div className="avatarWrapper">
                    <img className='displaynameIcond' src={discord} alt="discordIcon" />
                    <div className="statusIndicator"></div>
                </div>
                <div className="displaybox box2">
                    <div className="subBox1" title={displayName || "Discord User"}>
                        {displayName || "Discord User"}
                    </div>
                    <div className="subBox2" title={username ? `@${username}` : ""}>
                        @{username || "username"}
                    </div>
                </div>
                <div className="displaybox controls">
                    <div 
                        className={`displaynameIconWrapper ${isMuted ? 'slashed' : ''}`}
                        data-tooltip={isMuted ? "Unmute" : "Mute"}
                        onClick={handleMuteToggle}
                    >
                        <img
                            className='displaynameIcon'
                            src={mute}
                            alt="muteIcon"
                        />
                    </div>
                    <div 
                        className={`displaynameIconWrapper ${isDeafened ? 'slashed' : ''}`}
                        data-tooltip={isDeafened ? "Undeafen" : "Deafen"}
                        onClick={handleDeafenToggle}
                    >
                        <img className='displaynameIcon' src={headphone} alt="headphoneIcon" />
                    </div>
                    <div 
                        className="displaynameIconWrapper"
                        data-tooltip="User Settings"
                        onClick={() => setShowSettings(true)}
                    >
                        <img 
                            className='displaynameIcon' 
                            src={settings} 
                            alt="settingsIcon" 
                        />
                    </div>
                </div>
            </div>

            {showSettings && (
                <ProfileSettingsModal
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    onSave={(newDisp, newUsr) => {
                        setDisplayName(newDisp);
                        setUsername(newUsr);
                    }}
                    currentDisplayName={displayName}
                    currentUsername={username}
                />
            )}
        </>
    );
}

