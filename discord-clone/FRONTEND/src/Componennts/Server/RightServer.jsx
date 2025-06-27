import './css/RightServer.css'
import AudioChannel from '../channels/AudioChannels';
import GeneralChat from '../channels/GeneralChat';

export default function RightServer({ selectedChannel, servername }) {
    return (
        <div className="rightServerContainer">
            <nav className="channelHeaderNav">
                <h2>
                    {selectedChannel.type === 'text' && '#'}
                    {selectedChannel.type === 'audio' && '🎤'}
                    {selectedChannel.name}
                </h2>
            </nav>


            {selectedChannel.type === 'text' && (
                <GeneralChat
                    serverId={servername}
                    channelId={selectedChannel.name}
                />
            )}


            {selectedChannel.type === 'audio' && (
                <div className="audioChannelArea">
                    <AudioChannel channelName={`${servername}-${selectedChannel.name}`} />
                </div>
            )}
        </div>
    );
}
