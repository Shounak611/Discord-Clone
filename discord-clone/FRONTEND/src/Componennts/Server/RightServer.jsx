import { useState, useEffect, useRef } from 'react';
import './css/RightServer.css';
import AudioChannel from '../channels/AudioChannels';
import GeneralChat from '../channels/GeneralChat';

export default function RightServer({ selectedChannel, servername }) {
    const [connected, setConnected] = useState(false);
    const prevChannelRef = useRef({ name: "", type: "" });

    const handleConnect = () => {
        setConnected(true);
    };

    useEffect(() => {
        const changed =
            prevChannelRef.current.name !== selectedChannel.name ||
            prevChannelRef.current.type !== selectedChannel.type;

        if (changed) {
            setConnected(false);
            prevChannelRef.current = selectedChannel;
        }
    }, [selectedChannel]);

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
                    {!connected ? (
                        <button className="connectButton" onClick={handleConnect}>
                            Connect to Voice
                        </button>
                    ) : (
                        <AudioChannel
                            channelName={servername.replace(/[^a-zA-Z0-9\s!#$%&()+\-:;<.=?>@\[\]^_{|}~]/g, '')}
                            onDisconnect={() => setConnected(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
