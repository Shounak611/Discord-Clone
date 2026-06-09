import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../config';
import './css/ServerModal.css';

export default function ServerModal({ onClose }) {
  const [step, setStep] = useState('main');
  const [serverName, setServerName] = useState('');
  const [serverType, setServerType] = useState("public");
  const [inviteLink, setInviteLink] = useState('');
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate()

  const API_BASE = `${API_URL}server`;

  const handleCreateSubmit = async () => {
    if (serverName.trim() === '') {
      alert("Please enter a server name");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/create`, {
        name: serverName,
        owner_id: userId,
        server_type: serverType === "public" ? "public" : "private"
      });

      alert(`${response.data.message}`);
      onClose();
      navigate(`/server/${serverName}`);
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(`${err.response.data.detail}`);
      } else {
        alert("Failed to create server");
      }
    }
  };

  const handleJoinSubmit = async () => {
    let servername = inviteLink.trim();
    if (servername === '') {
      alert("Please enter a server name or invite link");
      return;
    }

    // Extract the server name if a URL is provided
    if (servername.includes('/server/')) {
      try {
        const parts = servername.split('/server/');
        // Extract the part right after '/server/' and strip any trailing query params or slash paths
        servername = decodeURIComponent(parts[parts.length - 1].split('/')[0].split('?')[0]);
      } catch (err) {
        alert("Enter a valid server invite link or server name");
        return;
      }
    }

    if (servername === '') {
      alert("Could not extract a valid server name");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/join`, {
        server_name: servername,
        user_id: userId
      });

      alert(`${response.data.message}`);
      onClose();
      navigate(`/server/${servername}`);
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(`${err.response.data.detail}`);
      } else {
        alert("Failed to join server. Make sure the server name or link is valid.");
      }
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {step === 'main' && (
          <>
            <h2 className="modal-title">Create or Join a Server</h2>
            <button className="modal-button create-btn" onClick={() => setStep('create')}>
              Create Your Server
            </button>
            <button className="modal-button join-btn" onClick={() => setStep('join')}>
              Join a Server
            </button>
            <button className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </>
        )}

        {step === 'create' && (
          <>
            <h2 className="modal-title">Enter Server Name</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="My Cool Server"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
            <div className='server-type'>
              <span>
                <input type="radio" name="serverType" id="public" value="public" checked={serverType === 'public'} onChange={() => setServerType('public')} />
                <label htmlFor="public">Public</label>
              </span>
              <span>
                <input type="radio" name="serverType" id="private" value="private" checked={serverType === 'private'} onChange={() => setServerType('private')} />
                <label htmlFor="private">Private</label>
              </span>
            </div>
            <button className="modal-button create-btn" onClick={handleCreateSubmit}>
              Create
            </button>
            <button className="close-btn" onClick={() => setStep('main')}>
              Back
            </button>
          </>
        )}

        {step === 'join' && (
          <>
            <h2 className="modal-title">Enter Server ID</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="http://localhost:5173/server/server_name"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />
            <button className="modal-button join-btn" onClick={handleJoinSubmit}>
              Join
            </button>
            <button className="close-btn" onClick={() => setStep('main')}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
