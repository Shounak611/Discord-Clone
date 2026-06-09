import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Asset Imports
import discordIcon from '../assets/discordIcon.png';
import addIcon from '../assets/addIcon.png';
import userIcon from '../assets/userIcon.png';
import plusIcon from '../assets/plusIcon.png';
import displayDiscordLogo from '../assets/displayDiscordlogo.png';

// Modal & Feature Component Imports
import ServerModal from '../Componennts/Server/ServerModal';
import Displayname from '../Componennts/Home/Displayname';
import Friends from '../Componennts/Home/Friends';
import Chat from '../Componennts/Home/Chat';
import OneToOneCall from '../Componennts/Chat/OneToOneCall';

// CSS Stylesheets
import '../Componennts/Home/css/LeftNav.css';
import '../Componennts/Home/css/LeftMid.css';
import '../Componennts/Home/css/TopNav.css';
import '../Componennts/Home/css/RightBox.css';
import '../Componennts/Home/css/Chat.css';
import './css/Home.css';

/**
 * NavigationSidebar - Displays the list of joined servers on the far left.
 * Allows switching between servers and clicking to open the add-server modal.
 */
function NavigationSidebar({ onOpenAddServerModal }) {
    const [servers, setServers] = useState([]);
    const userId = localStorage.getItem("user_id");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServers = async () => {
            if (!userId) {
                console.warn("User ID not found in localStorage");
                return;
            }
            try {
                const res = await axios.get(`http://localhost:8000/server/get_servers/${userId}`);
                setServers(res.data);
            } catch (error) {
                console.error("Error fetching servers in NavigationSidebar:", error);
            }
        };
        fetchServers();
    }, [userId]);

    return (
        <div className="leftnavC">
            <ul className="leftnavul">
                {/* Home/Discord Button */}
                <li>
                    <div className="elD" onClick={() => navigate('/home')} title="Direct Messages">
                        <img className="liIcon" src={discordIcon} alt="Discord Home" />
                    </div>
                </li>

                <li>
                    <div className="leftNavDivider"></div>
                </li>

                {/* Server Avatars */}
                {servers.map(server => (
                    <li key={server.id}>
                        <div
                            className="el"
                            title={server.name}
                            onClick={() => navigate(`/server/${server.name}`)}
                        >
                            <div className="servers">
                                {server.name.slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </li>
                ))}

                {/* Add Server Modal Trigger */}
                <li>
                    <div className="el addServer" onClick={onOpenAddServerModal} title="Add a Server">
                        <img className="liIcon" src={addIcon} alt="Add Server" />
                    </div>
                </li>
            </ul>
        </div>
    );
}

/**
 * ConversationSidebar - Renders DMs search bar, direct message contacts list,
 * and the user profile summary bar at the bottom.
 */
function ConversationSidebar({ selectedOption, onSelectedOption, friends }) {
    return (
        <div className="LeftMidC">
            <div className="leftMidScrollable">
                {/* Search Bar Button */}
                <div className="leftMidheader">
                    <div className="headerSearch">
                        <div className="searchInner">
                            <svg className="searchIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span className="searchText">Find or start a conversation</span>
                        </div>
                        <kbd className="searchShortcut">Ctrl+K</kbd>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="opts">
                    <div
                        className={`opt ${selectedOption === "Friends" ? "active" : ""}`}
                        onClick={() => onSelectedOption("Friends")}
                    >
                        <img className="leftMidIcons" src={userIcon} alt="Friends Tab" />
                        <p>Friends</p>
                    </div>
                </div>

                {/* Direct Messages Contact List */}
                <div className="dm">
                    <div className="dmheader">
                        <p>Direct Messages</p>
                        <img className="leftMidIcons" src={plusIcon} alt="Start Direct Message" />
                    </div>

                    <div className="dmList">
                        {friends.length === 0 ? (
                            <p className="noDM">No friends to show</p>
                        ) : (
                            friends.map((friend, index) => {
                                const isSelected = selectedOption === `Chat:${friend.username}`;
                                return (
                                    <div
                                        key={index}
                                        className={`dmFriend ${isSelected ? "active" : ""}`}
                                        onClick={() => onSelectedOption(`Chat:${friend.username}`)}
                                    >
                                        <div className="dmAvatarWrapper">
                                            <img className="dmAvatarIcon" src={displayDiscordLogo} alt="User Avatar" />
                                            <span 
                                                className="dmOnlineStatus" 
                                                style={{ backgroundColor: friend.status === 'online' ? '#23a55a' : '#80848e' }}
                                            ></span>
                                        </div>
                                        <p>{friend.display_name || friend.username}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* User Profile Bar */}
            <div className="leftMidUserProfile">
                <Displayname />
            </div>
        </div>
    );
}


/**
 * MainContentBox - Handles rendering the primary page workspace content
 * (displays either the Friends Dashboard or a specific active Chat room).
 */
function MainContentBox({ selectedOption, onToggleSidebar, friends, onInitiateCall }) {
    let friendName = null;

    if (selectedOption.startsWith("Chat:")) {
        friendName = selectedOption.split(":")[1];
    }

    return (
        <div className="rightBoxC">
            {selectedOption === "Friends" && <Friends onToggleSidebar={onToggleSidebar} friends={friends} />}
            {friendName && (
                <Chat 
                    frndName={friendName} 
                    onToggleSidebar={onToggleSidebar} 
                    onInitiateCall={onInitiateCall} 
                />
            )}
        </div>
    );
}

/**
 * Home - Parent Master Page Layout Component
 */
export default function Home() {
    const [selectedOption, setSelectedOption] = useState('Friends');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showServerModal, setShowServerModal] = useState(false);
    const [friends, setFriends] = useState([]);
    const [activeCall, setActiveCall] = useState(null);
    const [callingPartner, setCallingPartner] = useState(null);

    const activeCallRef = useRef(activeCall);
    activeCallRef.current = activeCall;

    const callingPartnerRef = useRef(callingPartner);
    callingPartnerRef.current = callingPartner;

    const globalWsRef = useRef(null);
    const rtcSignalHandlerRef = useRef(null);

    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                if (email) {
                    const response = await axios.get(`http://localhost:8000/friend/get-friends?email=${email}`);
                    setFriends(response.data);
                }
            } catch (error) {
                console.error("Error fetching friends in Home master:", error);
            }
        };
        fetchFriends();

        // Connect to status WebSocket to receive status updates of friends in real-time
        const token = localStorage.getItem("token");
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:8000/friend/ws?token=${encodeURIComponent(token)}`);
        globalWsRef.current = ws;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "status_change") {
                setFriends((prevFriends) => {
                    return prevFriends.map(friend => {
                        if (friend.username === msg.username) {
                            return { ...friend, status: msg.status };
                        }
                        return friend;
                    });
                });
            } else if (msg.type === "call_signal") {
                const content = msg.content;
                const sender = msg.sender_username;
                
                if (content.startsWith("__CALL_INITIATED__:")) {
                    const parts = content.split(":");
                    const type = parts[1];
                    const channelName = parts[2];
                    
                    setCallingPartner(sender);
                    setActiveCall({ type, status: 'incoming', channelName, isCaller: false });
                } else if (content.startsWith("__CALL_ACCEPTED__:")) {
                    const parts = content.split(":");
                    const channelName = parts[2];
                    if (activeCallRef.current && activeCallRef.current.channelName === channelName && activeCallRef.current.status !== 'connected') {
                        setActiveCall(prev => ({ ...prev, status: 'connected' }));
                    }
                } else if (content.startsWith("__CALL_DECLINED__:") || content.startsWith("__CALL_HUNGUP__:")) {
                    const parts = content.split(":");
                    const channelName = parts[2];
                    if (activeCallRef.current && activeCallRef.current.channelName === channelName) {
                        setActiveCall(null);
                        setCallingPartner(null);
                    }
                }
            } else if (msg.type === "rtc_signal") {
                if (rtcSignalHandlerRef.current) {
                    rtcSignalHandlerRef.current(msg.signal);
                }
            }
        };

        ws.onclose = () => {
            console.log("Status WebSocket connection closed");
            globalWsRef.current = null;
        };

        return () => {
            ws.close();
            globalWsRef.current = null;
        };
    }, [email]);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setSidebarOpen(false);
    };

    const sendSignalingMessage = async (partner, content) => {
        try {
            await axios.post(`http://localhost:8000/chat/send`, {
                sender_email: email,
                receiver_username: partner,
                content: content
            });
        } catch (err) {
            console.error("Error sending signaling message:", err);
        }
    };

    const handleInitiateCall = (type, partnerName) => {
        const senderPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const receiverPrefix = partnerName.replace(/[^a-zA-Z0-9]/g, '');
        const channelName = `call_${[senderPrefix, receiverPrefix].sort().join('_')}`;
        
        const content = `__CALL_INITIATED__:${type}:${channelName}`;
        
        // Log in database
        sendSignalingMessage(partnerName, content);
        
        // Send globally via status WebSocket
        if (globalWsRef.current && globalWsRef.current.readyState === WebSocket.OPEN) {
            globalWsRef.current.send(JSON.stringify({
                type: "call_signal",
                receiver_username: partnerName,
                content: content
            }));
        }
        
        setCallingPartner(partnerName);
        setActiveCall({ type, status: 'offering', channelName, isCaller: true });
    };

    const handleAcceptCall = () => {
        if (!activeCall || !callingPartner) return;
        const content = `__CALL_ACCEPTED__:${activeCall.type}:${activeCall.channelName}`;
        
        // Log in database
        sendSignalingMessage(callingPartner, content);
        
        // Send globally via status WebSocket
        if (globalWsRef.current && globalWsRef.current.readyState === WebSocket.OPEN) {
            globalWsRef.current.send(JSON.stringify({
                type: "call_signal",
                receiver_username: callingPartner,
                content: content
            }));
        }
        
        setActiveCall(prev => ({ ...prev, status: 'connected' }));
        setSelectedOption(`Chat:${callingPartner}`);
    };

    const handleDeclineCall = () => {
        if (!activeCall || !callingPartner) return;
        const content = `__CALL_DECLINED__:${activeCall.type}:${activeCall.channelName}`;
        
        // Log in database
        sendSignalingMessage(callingPartner, content);
        
        // Send globally via status WebSocket
        if (globalWsRef.current && globalWsRef.current.readyState === WebSocket.OPEN) {
            globalWsRef.current.send(JSON.stringify({
                type: "call_signal",
                receiver_username: callingPartner,
                content: content
            }));
        }
        
        setActiveCall(null);
        setCallingPartner(null);
    };

    const handleHangUp = () => {
        if (!activeCall || !callingPartner) return;
        const content = `__CALL_HUNGUP__:${activeCall.type}:${activeCall.channelName}`;
        
        // Log in database
        sendSignalingMessage(callingPartner, content);
        
        // Send globally via status WebSocket
        if (globalWsRef.current && globalWsRef.current.readyState === WebSocket.OPEN) {
            globalWsRef.current.send(JSON.stringify({
                type: "call_signal",
                receiver_username: callingPartner,
                content: content
            }));
        }
        
        setActiveCall(null);
        setCallingPartner(null);
    };

    const sendRtcSignal = (signal) => {
        if (globalWsRef.current && globalWsRef.current.readyState === WebSocket.OPEN) {
            globalWsRef.current.send(JSON.stringify({
                type: "rtc_signal",
                receiver_username: callingPartnerRef.current,
                signal: signal
            }));
        }
    };

    const registerSignalHandler = (handler) => {
        rtcSignalHandlerRef.current = handler;
    };

    return (
        <div className="styleHome">
            {/* Mobile Sidebar Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="homeContainer">
                {/* Sidebars Panel */}
                <div className={`leftBox ${sidebarOpen ? 'open' : ''}`}>
                    <NavigationSidebar
                        onOpenAddServerModal={() => setShowServerModal(true)}
                    />
                    <ConversationSidebar
                        selectedOption={selectedOption}
                        onSelectedOption={handleSelectOption}
                        friends={friends}
                    />
                </div>

                {/* Main Content Pane */}
                <div className="rightBox">
                    <div className="rightContent">
                        <MainContentBox
                            selectedOption={selectedOption}
                            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                            friends={friends}
                            onInitiateCall={handleInitiateCall}
                        />
                    </div>
                </div>
            </div>

            {/* Outgoing Calling Dialog */}
            {activeCall && activeCall.status === 'offering' && (
                <div className="callingOverlay" style={{ zIndex: 1001 }}>
                    <div className="callingCard">
                        <div className="avatarRing incomingPulse">
                            {callingPartner ? callingPartner.charAt(0).toUpperCase() : '?'}
                        </div>
                        <h3>Calling {callingPartner}...</h3>
                        <p>Waiting for response</p>
                        <button className="declineBtn" onClick={handleHangUp} style={{ marginTop: '20px' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Incoming Call Dialog */}
            {activeCall && activeCall.status === 'incoming' && (
                <div className="callingOverlay" style={{ zIndex: 1001 }}>
                    <div className="callingCard">
                        <div className="avatarRing incomingPulse">
                            {callingPartner ? callingPartner.charAt(0).toUpperCase() : '?'}
                        </div>
                        <h3>Incoming {activeCall.type === 'video' ? 'Video' : 'Voice'} Call</h3>
                        <p>from {callingPartner}</p>
                        <div className="incomingActions">
                            <button className="acceptBtn" onClick={handleAcceptCall}>Accept</button>
                            <button className="declineBtn" onClick={handleDeclineCall}>Decline</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Connected Call Screen */}
            {activeCall && activeCall.status === 'connected' && (
                <div className="callingOverlay" style={{ zIndex: 1002 }}>
                    <div style={{ width: '80%', maxWidth: '800px', background: '#1e1f22', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                        <OneToOneCall 
                            channelName={activeCall.channelName} 
                            isVideo={activeCall.type === 'video'} 
                            friendName={callingPartner} 
                            onHangUp={handleHangUp} 
                            isCaller={activeCall.isCaller}
                            sendRtcSignal={sendRtcSignal}
                            registerSignalHandler={registerSignalHandler}
                        />
                    </div>
                </div>
            )}

            {/* Server Modal Overlay */}
            {showServerModal && (
                <ServerModal onClose={() => setShowServerModal(false)} />
            )}
        </div>
    );
}