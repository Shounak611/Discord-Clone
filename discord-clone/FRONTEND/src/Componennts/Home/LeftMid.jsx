import user from '../../assets/userIcon.png'
import nitro from '../../assets/nitroIcon.png'
import shop from '../../assets/shopIcon.png'
import plus from '../../assets/plusIcon.png'
import './css/LeftMid.css'


export default function LeftMid({onSelectedOption}) {
    return (
        <div className="LeftMidC">
            <div className='leftMidheader'>
                <div className='header'><p>Find or start a conversation</p></div>
            </div>
            <div className="opts">
                <div className="opt" onClick={() => onSelectedOption("Friends")}>
                    <img className='leftMidIcons' src={user} alt="userIcon" /><p>Friends</p>
                </div>
                <div className="opt" onClick={() => onSelectedOption("Nitro")}>
                    <img className='leftMidIcons' src={nitro} alt="nitroIcon" /><p>Nitro</p>
                </div>
                <div className="opt" onClick={() => onSelectedOption("Shop")}>
                    <img className='leftMidIcons' src={shop} alt="shopIcon" /><p>Shop</p>
                </div>
            </div>
            <div className="dm">
                <div className="dmheader"><p>Direct Messages</p><img className='leftMidIcons' src={plus} alt="plusIcon" /></div>
            </div>
        </div>
    )
}