import user from '../../assets/userIcon.png'
import newchat from '../../assets/newchatIcon.png'
import dot from '../../assets/dotIcon.png'
import './css/FriendsNav.css'

export default function FriendsNav() {
    return (
        <div className='friendNavC'>
            <div className='leftFriendsNav'>
                <div className='lnc1'>
                    <img className='friendsNavIcons' src={user} alt="userIcon" /><p>Friends</p>
                </div>
                <img className='dot' src={dot} alt="dotIcon" />
                <div className='lnc2'><p>Add Friend</p></div>
            </div>
            <div className='rightFriendsNav'>
                <img className='friendsNavIcons' src={newchat} alt="newchatIcon" />
            </div>
        </div>
    )
}