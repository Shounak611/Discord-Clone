import help from '../../assets/helpIcon.png'
import user from '../../assets/userIcon.png'
import inbox from '../../assets/inboxIcon.png'
import './css/TopNav.css'

export default function TopNav(){
    return (
        <div className="topdiv">
            <div className='center'>
                <img className='icon' src={user} alt="user" />
                <p>Friends</p>
            </div>
            <div className='right'>
                <img className="icon" src={inbox} alt="inbox" />
                <img className='icon' src={help} alt="help" />
            </div>
        </div>
    )
}