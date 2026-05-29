import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ProfileSettingsModal.css";
import discord from "../../assets/displayDiscordlogo.png";

export default function ProfileSettingsModal({
    isOpen,
    onClose,
    onSave,
    currentDisplayName,
    currentUsername,
}) {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(currentDisplayName || "");
    const [username, setUsername] = useState(currentUsername || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Sync internal state when modal opens or props change
    useEffect(() => {
        if (isOpen) {
            setDisplayName(currentDisplayName || "");
            setUsername(currentUsername || "");
            setError("");
            setSuccess("");
        }
    }, [isOpen, currentDisplayName, currentUsername]);

    if (!isOpen) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const cleanDisp = displayName.trim();
        const cleanUsr = username.trim();

        if (!cleanDisp) {
            setError("Display name cannot be empty");
            return;
        }
        if (!cleanUsr) {
            setError("Username cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:8000/get_user/update", {
                display_name: cleanDisp,
                username: cleanUsr,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Sync with localStorage so other parts of the app are updated
            localStorage.setItem("user_name", res.data.username);
            
            setSuccess("Profile updated successfully!");
            onSave(res.data.display_name, res.data.username);
            
            // Auto close modal after successful update
            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to update profile settings.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isUnchanged = displayName.trim() === (currentDisplayName || "").trim() && 
                        username.trim() === (currentUsername || "").trim();

    return (
        <div className="profileModalOverlay" onClick={onClose}>
            <div className="profileCard" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                    {/* Banner */}
                    <div className="profileBanner">
                        <button className="profileModalClose" onClick={onClose} aria-label="Close modal" type="button">
                            ✕
                        </button>
                        <div className="profileAvatarContainer">
                            <img className="profileAvatarImg" src={discord} alt="Profile Avatar" />
                        </div>
                    </div>

                    {/* Profile Info Header */}
                    <div className="profileCardHeader">
                        <h2 className="profileHeaderName">{displayName || "Discord User"}</h2>
                        <p className="profileHeaderTag">@{username || "username"}</p>
                    </div>

                    {/* Form Fields */}
                    <div className="profileFormFields">
                        <div className="profileInputGroup">
                            <label htmlFor="edit-display-name">Display Name</label>
                            <div className="profileInputWrapper">
                                <input
                                    id="edit-display-name"
                                    type="text"
                                    className="profileInput"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your display name"
                                    maxLength={32}
                                />
                            </div>
                        </div>

                        <div className="profileInputGroup">
                            <label htmlFor="edit-username">Username</label>
                            <div className="profileInputWrapper">
                                <span className="profileInputPrefix">@</span>
                                <input
                                    id="edit-username"
                                    type="text"
                                    className="profileInput usernameInput"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username"
                                    maxLength={32}
                                />
                            </div>
                        </div>

                        {error && <div className="profileError">{error}</div>}
                        {success && <div className="profileSuccess">{success}</div>}
                    </div>

                    {/* Action buttons */}
                    <div className="profileActions">
                        <button
                            type="button"
                            className="profileBtnLogout"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                        <div style={{ flex: 1 }} />
                        <button
                            type="button"
                            className="profileBtnCancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="profileBtnSave"
                            disabled={loading || !displayName.trim() || !username.trim() || isUnchanged}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
