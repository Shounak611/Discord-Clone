import { useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useMicStatus } from '../../context/MicStatusContext';

const APP_ID = "14e971c70b824c55bd71c7181a7ac59b";

export default function AudioChannel({ channelName }) {
    const clientRef = useRef(null);
    const micTrackRef = useRef(null);
    const { micOn, setMicOn, setMicTrack } = useMicStatus();

    useEffect(() => {
        const startAudio = async () => {
            clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            await clientRef.current.join(APP_ID, channelName, null, null);

            micTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
            setMicTrack(micTrackRef.current);
            await clientRef.current.publish([micTrackRef.current]);
            setMicOn(true); // 🎤 mic is ON

            clientRef.current.on("user-published", async (user, mediaType) => {
                await clientRef.current.subscribe(user, mediaType);
                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
            });
        };

        startAudio();

        return () => {
            const cleanup = async () => {
                if (micTrackRef.current) {
                    micTrackRef.current.stop();
                    micTrackRef.current.close();
                }
                if (clientRef.current) {
                    await clientRef.current.leave();
                    clientRef.current.removeAllListeners();
                }
                setMicOn(false); // 🎤 mic is OFF
            };
            cleanup();
        };
    }, [channelName]);

    return <p>🎤 Connected to audio channel: <strong>{channelName}</strong></p>;
}
