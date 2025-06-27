import './css/Displayname.css'
import discord from '../../assets/displayDiscordlogo.png'
import headphone from '../../assets/headphoneIcon.png'
import mute from '../../assets/muteIcon.png'
import settings from '../../assets/settingsIcon.png'
import micOnIcon from '../../assets/micOnIcon.png' 
import axios from 'axios'
import { useEffect, useState } from 'react'         
import { useMicStatus } from '../../context/MicStatusContext'  


export default function Displayname(){
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const { micOn } = useMicStatus();
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/get_user?email=${encodeURIComponent(email)}`);
                setUsername(res.data.username);
                setDisplayName(res.data.display_name);
                localStorage.setItem("user_name",res.data.username);
                localStorage.setItem("user_id",res.data.id);
            } catch (error) {
                alert("Invalid user");
                console.error(error);
            }
        };

        if (email) {
            fetchUser();
        }
    }, [email]);

    return (
        <div className='displaynameC'>
            <div className="displaybox">
                <img className='displaynameIcond' src={discord} alt="discordIcon" />
            </div>
            <div className="displaybox box2">
                <div className="subBox1">{displayName}</div>
                <div className="subBox2">online</div>
            </div>
            <div className="displaybox ">
                <img
                    className='displaynameIcon'
                    src={micOn ? micOnIcon : mute}
                    alt={micOn ? "mic-on" : "muteIcon"}
                />
            </div>
            <div className="displaybox ">
                <img className='displaynameIcon' src={headphone} alt="headphoneIcon" />
            </div>
            <div className="displaybox ">
                <img className='displaynameIcon' src={settings} alt="settingsIcon" />
            </div>
        </div>
    );
}
