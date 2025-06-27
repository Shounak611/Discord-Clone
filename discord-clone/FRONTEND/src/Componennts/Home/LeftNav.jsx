import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import discord from '../../assets/discordIcon.png'
import add from '../../assets/addIcon.png'
import discovery from '../../assets/discoveryIcon.png'
import download from '../../assets/downloadIcon.png'
import './css/LeftNav.css'
import ServerModal from '../Server/ServerModal'

export default function LeftNav() {
    const [showModal, setShowModal] = useState(false)
    const [servers, setServers] = useState([])
    const userId = localStorage.getItem("user_id")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchServers = async () => {
            if (!userId) {
                console.warn("User ID not found in localStorage")
                return
            }

            try {
                const res = await axios.get(`http://localhost:8000/server/get_servers/${userId}`)
                setServers(res.data)
            } catch (error) {
                console.error("Error fetching servers:", error)
            }
        }

        fetchServers()
    }, [userId])

    return (
        <div className="leftnavC">
            <ul className='leftnavul'>
                {/* Discord icon */}
                <li>
                    <div className='elD' onClick={() => navigate('/home')}>
                        <img className='liIcon' src={discord} alt="discordIcon" />
                    </div>
                </li>


                {/* User Servers */}
                {servers.map(server => (
                    <li key={server.id}>
                        <div className='el' title={server.name} onClick={() => navigate(`/server/${server.name}`)}>
                            <div className='servers'>
                                {server.name.slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </li>
                ))}


                {/* Add Server */}
                <li>
                    <div className='el' onClick={() => setShowModal(true)}>
                        <img className='liIcon' src={add} alt="addIcon" />
                    </div>
                </li>

                {/* Discovery */}
                <li>
                    <div className='el'>
                        <img className='liIcon' src={discovery} alt="discoveryIcon" />
                    </div>
                </li>

                {/* Download */}
                <li>
                    <div className='el'>
                        <img className='liIcon' src={download} alt="downloadIcon" />
                    </div>
                </li>
            </ul>

            {showModal && <ServerModal onClose={() => setShowModal(false)} />}
        </div>
    )
}
