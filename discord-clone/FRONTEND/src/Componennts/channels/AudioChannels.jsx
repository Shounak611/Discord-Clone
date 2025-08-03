import React, { useState, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import "./css/AudioChannels.css";

const appId = "abbefe0cf86c4c7c905a54e8c12dd6dd";
const token = null;
export default function AudioChannel({ channelName, onDisconnect }) {
  const [joined, setJoined] = useState(false);
  const [rtcUid] = useState(Math.floor(Math.random() * 2032));
  const roomId = channelName;

  const rtcClientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const remoteAudioTracksRef = useRef({});
  const membersRef = useRef(null);

  useEffect(() => {
    return () => {
      leaveRoom(); 
    };
  }, []);

  const initRtc = async () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtcClientRef.current = client;

    client.on("user-joined", handleUserJoined);
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    await client.join(appId, roomId, token, rtcUid);
    localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish(localAudioTrackRef.current);

    addMember(rtcUid);
    setJoined(true);
  };

  const handleUserJoined = async (user) => {
    console.log("USER JOINED:", user);
    addMember(user.uid);
  };

  const handleUserPublished = async (user, mediaType) => {
    const client = rtcClientRef.current;
    await client.subscribe(user, mediaType);

    if (mediaType === "audio") {
      remoteAudioTracksRef.current[user.uid] = user.audioTrack;
      user.audioTrack.play();
    }
  };

  const handleUserLeft = async (user) => {
    delete remoteAudioTracksRef.current[user.uid];
    const userDiv = document.getElementById(user.uid);
    if (userDiv) userDiv.remove();
  };

  const addMember = (uid) => {
    if (!membersRef.current) return;
    const newDiv = document.createElement("div");
    newDiv.className = `speaker user-rtc-${uid}`;
    newDiv.id = uid;
    newDiv.innerHTML = `<p>${uid}</p>`;
    membersRef.current.appendChild(newDiv);
  };

  const leaveRoom = async () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }

    await rtcClientRef.current.unpublish();
    await rtcClientRef.current.leave();

    setJoined(false);
    membersRef.current.innerHTML = "";
  };

  const enterRoom = (e) => {
    e.preventDefault();
    initRtc();
  };

  return (
    <div>
      {!joined ? (
        <form id="form" onSubmit={enterRoom}>
          <button type="submit">Join Room</button>
        </form>
      ) : (
        <>
          <div id="room-header" style={{ display: "flex", marginBottom: "10px" }}>
            <h3>Agora Voice Room</h3>
            <button id="leave-icon" onClick={leaveRoom} style={{ marginLeft: "auto" }}>
              Leave Room
            </button>
          </div>
          <div id="members" ref={membersRef}></div>
        </>
      )}
    </div>
  );
};
