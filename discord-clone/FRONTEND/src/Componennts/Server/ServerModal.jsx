import { useState } from 'react';
import './css/ServerModal.css';

export default function ServerModal({ onClose }) {
  const [step, setStep] = useState('main'); // 'main', 'create', 'join'
  const [serverName, setServerName] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const handleCreateSubmit = () => {
    if (serverName.trim() !== '') {
      console.log("Server created:", serverName);
      onClose();
    } else {
      alert("Please enter a server name");
    }
  };

  const handleJoinSubmit = () => {
    if (inviteLink.trim() !== '') {
      console.log("Joined server with link:", inviteLink);
      onClose();
    } else {
      alert("Please enter an invite link");
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

            <button className="modal-button create-btn" onClick={handleCreateSubmit}>
              Create
            </button>

            <button className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </>
        )}

        {step === 'join' && (
          <>
            <h2 className="modal-title">Enter Invite Link</h2>

            <input
              type="text"
              className="modal-input"
              placeholder="https://discord.gg/your-invite"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />

            <button className="modal-button join-btn" onClick={handleJoinSubmit}>
              Join
            </button>

            <button className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
