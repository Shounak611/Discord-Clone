import './css/Chat.css'
import ChatNav from '../Chat/ChatNav'
import ChatLower from '../Chat/ChatLower'

export default function Chat({frndName}){
    return(
        <div className="chatC">
            <ChatNav frndName={frndName}/>
            <ChatLower frndName={frndName}/>
        </div>
    )
}