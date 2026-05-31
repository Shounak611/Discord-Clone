import { useState } from 'react';
import FriendsNav from '../Friends/FriendsNav'
import LeftFriends from '../Friends/LeftFriends'
import PendingRequests from '../Friends/PendingRequests'
import RightFriends from '../Friends/RightFriends'
import './css/Friends.css'

export default function Friends() {
    const [tab, setTab] = useState('add');

    return (
        <div className='friendsC'>
            <FriendsNav setTab={setTab} />
            <div className='friendsSubC'>
                <div className='friendsMainContent'>
                    {tab === 'add' && <LeftFriends />}
                    {tab === 'pending' && <PendingRequests />}
                </div>
                <RightFriends />
            </div>
        </div>
    )
}