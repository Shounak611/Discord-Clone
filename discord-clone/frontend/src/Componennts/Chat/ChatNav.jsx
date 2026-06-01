import './css/ChatNav.css'
import discord from '../../assets/displayDiscordlogo.png'
import call from '../../assets/call.png'
import video from '../../assets/video_call.png'
import pin from '../../assets/pin.png'
import addfriend from '../../assets/userAddChat.png'
import user from '../../assets/userChat.png'

export default function ChatNav({ frndName, onInitiateCall, onToggleSidebar }) {
    return (
        <div className='chatNavC'>
            <div className='chatNavL'>
                {/* Mobile Menu Hamburger Button */}
                <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <img className='iconsizeD' src={discord} alt="discordLogo" />
                <p>{frndName}</p>
            </div>
            <div className='chatNavR'>
                <img 
                    className='iconsize' 
                    src={call} 
                    alt="call" 
                    onClick={() => onInitiateCall && onInitiateCall('audio')}
                    style={{ cursor: 'pointer' }}
                    title="Start Voice Call"
                />
                <img 
                    className='iconsize' 
                    src={video} 
                    alt="video call" 
                    onClick={() => onInitiateCall && onInitiateCall('video')}
                    style={{ cursor: 'pointer' }}
                    title="Start Video Call"
                />
                <img className='iconsize' src={pin} alt="pin" />
                <img className='iconsize' src={addfriend} alt="addfriend" />
                <img className='iconsize' src={user} alt="user" />
                <input type="text" placeholder='Search'/>
            </div>
        </div>
    )
}