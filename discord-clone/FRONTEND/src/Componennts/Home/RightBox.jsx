import Friends from './Friends'
import Chat from '../Home/Chat'
import './css/RightBox.css'

export default function RightBox({ selected }) {
    let frndName = null;

    if (selected.startsWith("Chat:")) {
        frndName = selected.split(":")[1];
    }

    return (
        <div className="rightBoxC">
            {selected === "Friends" && <Friends />}
            {selected === "Nitro" && <h1>Discover Nitro benefits here!</h1>}
            {selected === "Shop" && <h1>Browse items in the Discord Shop</h1>}
            {frndName && <Chat frndName={frndName} />}
        </div>
    );
}
