import user from '../../assets/userIcon.png';
import newchat from '../../assets/newchatIcon.png';
import dot from '../../assets/dotIcon.png';
import './css/FriendsNav.css';

export default function FriendsNav({ currentTab, setTab }) {
    return (
        <div className='friendNavC'>
            <div className='leftFriendsNav'>
                <div className='lnc1'>
                    <img className='friendsNavIcons' src={user} alt="userIcon" />
                    <p onClick={() => setTab('friends')}>Friends</p>
                </div>
                <img className='dot' src={dot} alt="dotIcon" />
                <div className='lnc2' onClick={() => setTab('add')}><p>Add Friend</p></div>
                <div className='lnc2' onClick={() => setTab('pending')}><p>Pending Request</p></div>
            </div>
            <div className='rightFriendsNav'>
                <img className='friendsNavIcons' src={newchat} alt="newchatIcon" />
            </div>
        </div>
    );
}
