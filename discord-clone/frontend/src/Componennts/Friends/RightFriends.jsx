import './css/RightFriends.css';

export default function RightFriends() {
    const activeActivities = [
        {
            id: 1,
            user: "Aria",
            tag: "@aria_dev",
            avatarColor: "#8b5cf6",
            avatarLetter: "A",
            type: "LISTENING_TO_SPOTIFY",
            title: "Spotify",
            name: "Blinding Lights",
            details: "by The Weeknd",
            state: "Album: After Hours",
            time: "1:42 / 3:20",
            progress: 52,
            iconColor: "#1db954"
        },
        {
            id: 2,
            user: "Xenon",
            tag: "@xenon_99",
            avatarColor: "#ec4899",
            avatarLetter: "X",
            type: "PLAYING_GAME",
            title: "Valorant",
            name: "In a Competitive Match",
            details: "Score: 11 - 9",
            state: "Agent: Jett",
            time: "42m elapsed",
            iconColor: "#ff4655"
        },
        {
            id: 3,
            user: "Nova",
            tag: "@nova_codes",
            avatarColor: "#06b6d4",
            avatarLetter: "N",
            type: "CODING",
            title: "Visual Studio Code",
            name: "Editing Home.jsx",
            details: "Workspace: discord-clone",
            state: "Lines: 128 / 340",
            time: "for 2 hours",
            iconColor: "#007acc"
        }
    ];

    return (
        <div className='rightFriendsC'>
            <div className='rightFriendsHeader'>
                <h3>Active Now</h3>
                <span className='livePulse'></span>
            </div>

            <div className='activitiesList'>
                {activeActivities.map(activity => (
                    <div key={activity.id} className='activityCard'>
                        <div className='activityCardUser'>
                            <div className='activityAvatarWrapper'>
                                <div 
                                    className='activityAvatar' 
                                    style={{ backgroundColor: activity.avatarColor }}
                                >
                                    {activity.avatarLetter}
                                </div>
                                <span className='activityOnlineStatus'></span>
                            </div>
                            <div className='activityUserMeta'>
                                <span className='activityUsername'>{activity.user}</span>
                                <span className='activityUserTag'>{activity.tag}</span>
                            </div>
                        </div>

                        <div className='activityDetailsBox'>
                            <div className='activityHeaderRow'>
                                <span className='activityTypeLabel'>
                                    {activity.type === 'LISTENING_TO_SPOTIFY' ? 'Listening to' : 'Playing'}
                                </span>
                                <span 
                                    className='activityBadge' 
                                    style={{ backgroundColor: activity.iconColor }}
                                >
                                    {activity.title}
                                </span>
                            </div>
                            <h4 className='activityTrackName'>{activity.name}</h4>
                            <p className='activityTrackArtist'>{activity.details}</p>
                            {activity.state && <p className='activityTrackAlbum'>{activity.state}</p>}
                            
                            {activity.type === 'LISTENING_TO_SPOTIFY' ? (
                                <div className='spotifyProgressContainer'>
                                    <div className='spotifyProgressBar'>
                                        <div 
                                            className='spotifyProgressFill' 
                                            style={{ width: `${activity.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className='spotifyProgressTime'>
                                        <span>{activity.time.split(" / ")[0]}</span>
                                        <span>{activity.time.split(" / ")[1]}</span>
                                    </div>
                                </div>
                            ) : (
                                <span className='activityTimeElapsed'>{activity.time}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}