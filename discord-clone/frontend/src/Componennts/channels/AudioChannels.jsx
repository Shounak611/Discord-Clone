import micoff from "../../assets/muteIcon.png";
import micon from "../../assets/micOnIcon.png";
import leave_room from "../../assets/leave_room.png";
import discordlogo from "../../assets/displayDiscordlogo.png";
import speakerOnIcon from "../../assets/speakerOn.png";
import speakerOff from "../../assets/speakerOff.png";

import React, { useState, useRef, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import "./css/AudioChannels.css";

const appId = "abbefe0cf86c4c7c905a54e8c12dd6dd";
const token = null;

export default function AudioChannel({ channelName, onDisconnect }) {
  const [userName] = useState(() => localStorage.getItem("user_name") || "You");
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
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

    addMember(rtcUid, userName);
    setJoined(true);
  };

  const handleUserJoined = (user) => {
    addMember(user.uid, `User-${user.uid}`);
  };

  const handleUserPublished = async (user, mediaType) => {
    const client = rtcClientRef.current;
    await client.subscribe(user, mediaType);

    if (mediaType === "audio") {
      remoteAudioTracksRef.current[user.uid] = user.audioTrack;
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    delete remoteAudioTracksRef.current[user.uid];
    const userDiv = document.getElementById(`user-${user.uid}`);
    if (userDiv) userDiv.remove();
  };


  const addMember = (uid, name) => {
    if (!membersRef.current) return;
    const existing = document.getElementById(`user-${uid}`);
    if (existing) return;

    const displayName = uid === rtcUid ? userName : name;

    const memberCard = document.createElement("div");
    memberCard.className = `member-card user-rtc-${uid}`;
    memberCard.id = `user-${uid}`;
    memberCard.innerHTML = `
    <div class="member-avatar">${displayName.charAt(0).toUpperCase()}</div>
    <p class="member-name">${displayName}</p>
  `;
    membersRef.current.appendChild(memberCard);
  };


  const leaveRoom = async () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }

    await rtcClientRef.current.unpublish();
    await rtcClientRef.current.leave();

    setJoined(false);
    if (membersRef.current) membersRef.current.innerHTML = "";
    if (onDisconnect) onDisconnect();
  };

  const toggleMic = async () => {
    if (!localAudioTrackRef.current) return;
    await localAudioTrackRef.current.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleSpeaker = () => {
    Object.values(remoteAudioTracksRef.current).forEach(track =>
      track.setVolume(speakerOn ? 0 : 100)
    );
    setSpeakerOn(!speakerOn);
  };

  return (
    <div className="audio-channel-wrapper">
      {!joined ? (
        <form id="form" onSubmit={(e) => { e.preventDefault(); initRtc(); }}>
          <button type="submit">Join Room</button>
        </form>
      ) : (
        <div className="audio-ui-container">
          <div className="audio-left-panel">
            <img src={discordlogo} alt="discord" className="logo-icon" />
            <div className="user-label">{userName}</div>
            <div className="controls-group">
              <img
                src={micOn ? micon : micoff}
                alt="mic toggle"
                className="icon-button"
                onClick={toggleMic}
                title={micOn ? "Mute Mic" : "Unmute Mic"}
              />
              <img
                src={speakerOn ? speakerOnIcon : speakerOff}
                alt="speaker toggle"
                className="icon-button"
                onClick={toggleSpeaker}
                title={speakerOn ? "Mute Speaker" : "Unmute Speaker"}
              />
              <img
                src={leave_room}
                alt="leave"
                className="icon-button"
                onClick={leaveRoom}
                title="Leave Room"
              />
            </div>
          </div>

          <div className="audio-right-panel">
            <h3>Participants</h3>
            <div id="members" ref={membersRef}></div>
          </div>
        </div>
      )}
    </div>
  );
}
