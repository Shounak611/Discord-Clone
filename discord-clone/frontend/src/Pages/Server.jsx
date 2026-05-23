import { useState } from "react"
import { useParams } from 'react-router-dom'
import ServerTopNav from "../Componennts/Server/ServerTopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftServer from "../Componennts/Server/LeftServer"
import Displayname from "../Componennts/Home/Displayname"
import RightServer from "../Componennts/Server/RightServer"

import './css/Server.css'

export default function Server(){
    const [selectedChannel, setSelectedChannel] = useState({ type: 'text', name: 'general' })
    const { servername } = useParams()

    return (
        <div className="styleHome">
            <ServerTopNav servername={servername} />
            <div className="homeContainer">
                <div className="leftBox">
                    <LeftNav />
                    <LeftServer
                        servername={servername}
                        selectedChannel={selectedChannel}
                        setSelectedChannel={setSelectedChannel}
                    />
                </div>
                <div className="rightBox">
                    <RightServer selectedChannel={selectedChannel} servername={servername} />
                </div>
            </div>
        </div>
    )
}
