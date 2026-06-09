import './css/RightFriends.css';

const getActivityForFriend = (friendName) => {
    // A simple stable hash based on the name to give consistent dummy activities to users
    let hash = 0;
    for (let i = 0; i < friendName.length; i++) {
        hash = friendName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    
    const avatarColors = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];
    const avatarColor = avatarColors[hash % avatarColors.length];
    
    // 0: Spotify, 1: Game, 2: Coding (ensure every online friend has an activity to show up in Active Now)
    const activityType = hash % 3;
    
    if (activityType === 0) {
        const tracks = [
            { name: "Starboy", details: "by The Weeknd", state: "Album: Starboy", progress: 65, time: "2:34 / 3:50" },
            { name: "Blinding Lights", details: "by The Weeknd", state: "Album: After Hours", progress: 52, time: "1:42 / 3:20" },
            { name: "Stay", details: "by The Kid LAROI & Justin Bieber", state: "Album: F*CK LOVE 3", progress: 30, time: "0:48 / 2:21" },
            { name: "As It Was", details: "by Harry Styles", state: "Album: Harry's House", progress: 80, time: "2:16 / 2:47" }
        ];
        const track = tracks[hash % tracks.length];
        return {
            id: hash,
            user: friendName,
            tag: `@${friendName.toLowerCase()}`,
            avatarColor,
            avatarLetter: friendName.charAt(0).toUpperCase(),
            type: "LISTENING_TO_SPOTIFY",
            title: "Spotify",
            name: track.name,
            details: track.details,
            state: track.state,
            time: track.time,
            progress: track.progress,
            iconColor: "#1db954"
        };
    } else if (activityType === 1) {
        const games = [
            { title: "Valorant", name: "In a Competitive Match", details: "Score: 11 - 9", state: "Agent: Jett", time: "42m elapsed", iconColor: "#ff4655" },
            { title: "Minecraft", name: "Survival Mode", details: "Building a castle", state: "Multiplayer Server", time: "1h 15m elapsed", iconColor: "#5b8731" },
            { title: "League of Legends", name: "Ranked Solo/Duo", details: "Champion: Yasuo", state: "In Game - 24:12", time: "24m elapsed", iconColor: "#f0a824" }
        ];
        const game = games[hash % games.length];
        return {
            id: hash,
            user: friendName,
            tag: `@${friendName.toLowerCase()}`,
            avatarColor,
            avatarLetter: friendName.charAt(0).toUpperCase(),
            type: "PLAYING_GAME",
            ...game
        };
    } else if (activityType === 2) {
        const workspaces = [
            { name: "Editing main.py", details: "Workspace: backend", state: "Lines: 45 / 120", time: "for 45 minutes", iconColor: "#007acc" },
            { name: "Debugging Chat.jsx", details: "Workspace: discord-clone", state: "Lines: 180 / 228", time: "for 2 hours", iconColor: "#007acc" }
        ];
        const workspace = workspaces[hash % workspaces.length];
        return {
            id: hash,
            user: friendName,
            tag: `@${friendName.toLowerCase()}`,
            avatarColor,
            avatarLetter: friendName.charAt(0).toUpperCase(),
            type: "CODING",
            title: "Visual Studio Code",
            ...workspace
        };
    } else {
        // Just online, no status activity card
        return null;
    }
};

export default function RightFriends({ friends = [] }) {
    // Filter out friends who are online
    const onlineFriends = friends.filter(friend => friend.status === 'online');
    
    // Map them to activities, discarding null (no activity)
    const activeActivities = onlineFriends
        .map(friend => getActivityForFriend(friend.display_name || friend.username))
        .filter(activity => activity !== null);

    return (
        <div className='rightFriendsC'>
            <div className='rightFriendsHeader'>
                <h3>Active Now</h3>
                <span className='livePulse'></span>
            </div>

            <div className='activitiesList'>
                {activeActivities.length === 0 ? (
                    <div className='noActivitiesCard'>
                        <h4>It's quiet for now...</h4>
                        <p>When a friend starts an activity—like playing a game or listening to Spotify—we'll show it here!</p>
                    </div>
                ) : (
                    activeActivities.map(activity => (
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
                    ))
                )}
            </div>
        </div>
    );
}