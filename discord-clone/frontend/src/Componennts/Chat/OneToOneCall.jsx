import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import micoff from "../../assets/muteIcon.png";
import micon from "../../assets/micOnIcon.png";
import leave_room from "../../assets/leave_room.png";
import videoIcon from "../../assets/video_call.png";
import "./css/OneToOneCall.css";

const appId = "abbefe0cf86c4c7c905a54e8c12dd6dd";
const token = null;

export default function OneToOneCall({ channelName, isVideo, onHangUp, friendName }) {
    const [userName] = useState(() => localStorage.getItem("user_name") || "You");
    const [joined, setJoined] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(isVideo);
    const [remoteUserJoined, setRemoteUserJoined] = useState(false);

    const rtcClientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);
    const rtcUid = useRef(null);

    useEffect(() => {
        initCall();
        return () => {
            leaveCall();
        };
    }, []);

    const initCall = async () => {
        try {
            const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            rtcClientRef.current = client;

            client.on("user-published", handleUserPublished);
            client.on("user-unpublished", handleUserUnpublished);
            client.on("user-left", handleUserLeft);

            // Join channel
            const uid = await client.join(appId, channelName, token, null);
            rtcUid.current = uid;

            // Create and publish local tracks
            const tracks = [];
            
            // Audio track
            localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
            tracks.push(localAudioTrackRef.current);

            // Video track (if video is enabled)
            if (isVideo) {
                try {
                    localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
                    tracks.push(localVideoTrackRef.current);
                    
                    // Play local video
                    setTimeout(() => {
                        const localEl = document.getElementById("local-video-stream");
                        if (localVideoTrackRef.current && localEl) {
                            localVideoTrackRef.current.play("local-video-stream");
                        }
                    }, 500);
                } catch (videoError) {
                    console.error("Failed to access camera:", videoError);
                    setCameraOn(false);
                }
            }

            await client.publish(tracks);
            setJoined(true);
        } catch (err) {
            console.error("Agora RTC initialization failed:", err);
        }
    };

    const handleUserPublished = async (user, mediaType) => {
        const client = rtcClientRef.current;
        if (!client) return;
        
        await client.subscribe(user, mediaType);

        if (mediaType === "audio") {
            user.audioTrack.play();
        }
        
        if (mediaType === "video") {
            setRemoteUserJoined(true);
            setTimeout(() => {
                const remoteEl = document.getElementById("remote-video-stream");
                if (user.videoTrack && remoteEl) {
                    user.videoTrack.play("remote-video-stream");
                }
            }, 500);
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        if (mediaType === "video") {
            setRemoteUserJoined(false);
        }
    };

    const handleUserLeft = (user) => {
        setRemoteUserJoined(false);
    };

    const leaveCall = async () => {
        try {
            if (localAudioTrackRef.current) {
                localAudioTrackRef.current.stop();
                localAudioTrackRef.current.close();
                localAudioTrackRef.current = null;
            }
            if (localVideoTrackRef.current) {
                localVideoTrackRef.current.stop();
                localVideoTrackRef.current.close();
                localVideoTrackRef.current = null;
            }

            if (rtcClientRef.current) {
                await rtcClientRef.current.leave();
                rtcClientRef.current = null;
            }
        } catch (e) {
            console.error(e);
        }
        setJoined(false);
    };

    const toggleMic = async () => {
        if (localAudioTrackRef.current) {
            await localAudioTrackRef.current.setEnabled(!micOn);
            setMicOn(!micOn);
        }
    };

    const toggleCamera = async () => {
        if (!joined || !rtcClientRef.current) return;
        
        try {
            if (cameraOn) {
                // Turn off camera
                if (localVideoTrackRef.current) {
                    await rtcClientRef.current.unpublish(localVideoTrackRef.current);
                    localVideoTrackRef.current.stop();
                    localVideoTrackRef.current.close();
                    localVideoTrackRef.current = null;
                }
                setCameraOn(false);
            } else {
                // Turn on camera
                localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
                await rtcClientRef.current.publish(localVideoTrackRef.current);
                setCameraOn(true);
                
                setTimeout(() => {
                    const localEl = document.getElementById("local-video-stream");
                    if (localVideoTrackRef.current && localEl) {
                        localVideoTrackRef.current.play("local-video-stream");
                    }
                }, 500);
            }
        } catch (err) {
            console.error("Error toggling camera:", err);
        }
    };

    return (
        <div className="oneToOneCallC">
            <div className="callHeader">
                <div className="callTitle">
                    <span className="liveBadge">LIVE</span>
                    <p>{cameraOn || remoteUserJoined ? "Video Call" : "Voice Call"} with {friendName}</p>
                </div>
            </div>

            <div className="mediaContainer">
                {cameraOn || remoteUserJoined ? (
                    <div className="videoGrid">
                        {/* Remote User Video */}
                        <div className="videoCard remoteVideo">
                            <div id="remote-video-stream" className="videoStream"></div>
                            {!remoteUserJoined && (
                                <div className="videoPlaceholder">
                                    <div className="placeholderAvatar">{friendName.charAt(0).toUpperCase()}</div>
                                    <p>Waiting for {friendName}'s camera...</p>
                                </div>
                            )}
                            <div className="videoLabel">{friendName}</div>
                        </div>

                        {/* Local User Video */}
                        <div className="videoCard localVideo">
                            <div id="local-video-stream" className="videoStream"></div>
                            {!cameraOn && (
                                <div className="videoPlaceholder">
                                    <div className="placeholderAvatar">{userName.charAt(0).toUpperCase()}</div>
                                    <p>Camera is off</p>
                                </div>
                            )}
                            <div className="videoLabel">You</div>
                        </div>
                    </div>
                ) : (
                    <div className="voiceGrid">
                        <div className="voiceCard activeSpeaker">
                            <div className="voiceAvatarContainer">
                                <div className={`voiceAvatar ${micOn ? 'pulseRing' : ''}`}>
                                    {friendName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <p className="voiceName">{friendName}</p>
                            <span className="voiceStatus">Connected</span>
                        </div>
                        <div className="voiceCard">
                            <div className="voiceAvatarContainer">
                                <div className={`voiceAvatar ${micOn ? 'pulseRingActive' : ''}`}>
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <p className="voiceName">You</p>
                            <span className="voiceStatus">{micOn ? "Speaking" : "Muted"}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="callControls">
                <button 
                    className={`callBtn ${!micOn ? 'active' : ''}`}
                    onClick={toggleMic}
                    title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                    <img src={micOn ? micon : micoff} alt="Mute" />
                </button>

                <button 
                    className={`callBtn ${!cameraOn ? 'active' : ''}`}
                    onClick={toggleCamera}
                    title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                    <img src={videoIcon} alt="Camera" style={{ filter: cameraOn ? 'none' : 'grayscale(1) brightness(0.6)' }} />
                </button>

                <button 
                    className="callBtn hangUp"
                    onClick={onHangUp}
                    title="End Call"
                >
                    <img src={leave_room} alt="End Call" />
                </button>
            </div>
        </div>
    );
}
