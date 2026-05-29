import './css/ChatNav.css'
import discord from '../../assets/displayDiscordlogo.png'
import call from '../../assets/call.png'
import video from '../../assets/video_call.png'
import pin from '../../assets/pin.png'
import addfriend from '../../assets/userAddChat.png'
import user from '../../assets/userChat.png'

export default function ChatNav({frndName, onInitiateCall}){
    return(
        <div className='chatNavC'>
            <div className='chatNavL'>
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