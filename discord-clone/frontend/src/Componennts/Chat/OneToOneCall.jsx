import React, { useState, useEffect, useRef } from "react";
import micoff from "../../assets/muteIcon.png";
import micon from "../../assets/micOnIcon.png";
import leave_room from "../../assets/leave_room.png";
import videoIcon from "../../assets/video_call.png";
import "./css/OneToOneCall.css";

export default function OneToOneCall({ 
    channelName, 
    isVideo, 
    onHangUp, 
    friendName, 
    isCaller, 
    sendRtcSignal, 
    registerSignalHandler 
}) {
    const [userName] = useState(() => localStorage.getItem("user_name") || "You");
    const [joined, setJoined] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(isVideo);
    const [remoteUserJoined, setRemoteUserJoined] = useState(false);

    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const signalQueueRef = useRef([]);

    useEffect(() => {
        // Register signaling callback from WebSocket
        registerSignalHandler((signal) => {
            if (pcRef.current) {
                handleRtcSignal(signal);
            } else {
                signalQueueRef.current.push(signal);
            }
        });

        initCall();

        return () => {
            registerSignalHandler(null);
            leaveCall();
        };
    }, []);

    const initCall = async () => {
        try {
            // Get local audio and optionally video
            const constraints = {
                audio: true,
                video: isVideo
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStreamRef.current = stream;

            if (isVideo && localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Create WebRTC Peer Connection
            const configuration = {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" }
                ]
            };
            const pc = new RTCPeerConnection(configuration);
            pcRef.current = pc;

            // Add local tracks to peer connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Send local ICE candidates to peer
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    sendRtcSignal({
                        type: "candidate",
                        candidate: event.candidate
                    });
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log("ICE connection state:", pc.iceConnectionState);
            };

            // Play remote track when received
            pc.ontrack = (event) => {
                console.log("Remote track received:", event.track.kind);
                const remoteStream = event.streams[0];
                if (isVideo && remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                } else if (!isVideo && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = remoteStream;
                    remoteAudioRef.current.play().catch(e => {
                        console.warn("Audio autoplay blocked by browser policy:", e);
                    });
                }
                setRemoteUserJoined(true);
            };

            // Process any queued signaling messages
            const processQueue = async () => {
                while (signalQueueRef.current.length > 0) {
                    const queuedSignal = signalQueueRef.current.shift();
                    await handleRtcSignal(queuedSignal);
                }
            };
            await processQueue();

            // If we are the one initiating the call, create offer
            if (isCaller) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                sendRtcSignal({
                    type: "offer",
                    offer: offer
                });
            }

            setJoined(true);
        } catch (err) {
            console.error("WebRTC initialization failed:", err);
            // Fallback for missing permissions/devices
            setJoined(true);
        }
    };

    const handleRtcSignal = async (signal) => {
        const pc = pcRef.current;
        if (!pc) return;

        try {
            if (signal.type === "offer") {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                sendRtcSignal({
                    type: "answer",
                    answer: answer
                });
            } else if (signal.type === "answer") {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
            } else if (signal.type === "candidate") {
                if (signal.candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
            }
        } catch (err) {
            console.error("Error handling RTC signal:", err);
        }
    };

    const leaveCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        setJoined(false);
        setRemoteUserJoined(false);
    };

    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setCameraOn(videoTrack.enabled);
            }
        }
    };

    return (
        <div className="oneToOneCallC">
            <div className="callHeader">
                <div className="callTitle">
                    <span className="liveBadge">LIVE</span>
                    <p>{isVideo ? "Video Call" : "Voice Call"} with {friendName}</p>
                </div>
            </div>

            <div className="mediaContainer">
                {isVideo ? (
                    <div className="videoGrid">
                        {/* Remote User Video */}
                        <div className="videoCard remoteVideo">
                            <video 
                                ref={remoteVideoRef} 
                                className="videoStream" 
                                autoPlay 
                                playsInline 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: remoteUserJoined ? 'block' : 'none' }}
                            />
                            {!remoteUserJoined && (
                                <div className="videoPlaceholder">
                                    <div className="placeholderAvatar">{friendName.charAt(0).toUpperCase()}</div>
                                    <p>Waiting for {friendName} to join...</p>
                                </div>
                            )}
                            <div className="videoLabel">{friendName}</div>
                        </div>

                        {/* Local User Video */}
                        <div className="videoCard localVideo">
                            <video 
                                ref={localVideoRef} 
                                className="videoStream" 
                                autoPlay 
                                playsInline 
                                muted 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraOn ? 'block' : 'none' }}
                            />
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
                        <audio ref={remoteAudioRef} autoPlay />
                        <div className="voiceCard activeSpeaker">
                            <div className="voiceAvatarContainer">
                                <div className={`voiceAvatar ${micOn && remoteUserJoined ? 'pulseRing' : ''}`}>
                                    {friendName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <p className="voiceName">{friendName}</p>
                            <span className="voiceStatus">{remoteUserJoined ? "Connected" : "Connecting..."}</span>
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
