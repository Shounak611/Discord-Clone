import './css/Chat.css'
import ChatNav from '../Chat/ChatNav'

export default function Chat({frndName}){
    return(
        <div className="chatC">
            <ChatNav frndName={frndName}/>
        </div>
    )
}