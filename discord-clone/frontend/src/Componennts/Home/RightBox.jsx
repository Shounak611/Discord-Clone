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
            {frndName && <Chat frndName={frndName} />}
        </div>
    );
}
