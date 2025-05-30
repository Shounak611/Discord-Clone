import FriendsNav from '../Friends/FriendsNav'
import LeftFriends from '../Friends/LeftFriends'
import RightFriends from '../Friends/RightFriends'
import './css/Friends.css'

export default function Friends(){
    return(

        <div className='friendsC'>
            <FriendsNav/>
            <div className='friendsSubC'>
                <LeftFriends/>
                <RightFriends/>
            </div>
        </div>
    )
}