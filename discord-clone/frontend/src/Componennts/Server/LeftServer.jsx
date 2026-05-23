import { useState } from 'react'
import Displayname from '../Home/Displayname'
import './css/LeftServer.css'

export default function LeftServer({ servername, setSelectedChannel }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`http://localhost:5173/server/${servername}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="leftContainerC">
            <div className="leftServerScrollable">
                <div className="serverName">
                    <p>{servername}</p>
                </div>
                <div className='middle'>
                    <p className='sopt'>Events</p>
                    <div className="inviteLink">
                        <span>Invite Link:</span>
                        <input
                            type="text"
                            readOnly
                            value={`http://localhost:5173/server/${servername}`}
                            onClick={(e) => e.target.select()}
                            className="inviteInput"
                        />
                    </div>
                    <button className="copyBtn" onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>

                <div className="channelSection">
                    <div className="channelHeader">
                        <span>Text Channels</span>
                        <span className="plusIcon">+</span>
                    </div>
                    <div
                        className="channelItem"
                        onClick={() => setSelectedChannel({ type: 'text', name: 'general' })}
                    >
                        <span className="channelSymbol">#</span> general
                    </div>

                    <div className="channelHeader">
                        <span>Audio Channels</span>
                        <span className="plusIcon">+</span>
                    </div>
                    <div
                        className="channelItem"
                        onClick={() => setSelectedChannel({ type: 'audio', name: 'general' })}
                    >
                        <span className="channelSymbol">🎤</span> general
                    </div>
                </div>
            </div>

            <div className="leftServerUserProfile">
                <Displayname />
            </div>
        </div>
    )
}
