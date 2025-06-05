import Friends from './Friends'
import Chat from '../Home/Chat'
import './css/RightBox.css'

export default function RightBox({ selected }) {
    return (
        <div className="rightBoxC">
            {selected === "Friends" && <Friends/>}
            {selected === "Nitro" && <h1>Discover Nitro benefits here!</h1>}
            {selected === "Shop" && <h1>Browse items in the Discord Shop</h1>}
            {selected === "chat" && <Chat/>}
        </div>
    )
}
