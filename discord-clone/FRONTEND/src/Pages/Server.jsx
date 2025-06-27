import { useState } from "react"
import { useParams } from 'react-router-dom'
import ServerTopNav from "../Componennts/Server/ServerTopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftServer from "../Componennts/Server/LeftServer"
import Displayname from "../Componennts/Home/Displayname"

import './css/Server.css'

export default function Server(){
    const [selectedOption, setSelectedOption] = useState('Chat');
    const { servername } = useParams()
    return (

        <div className="styleHome">
            <ServerTopNav servername={servername} />
            <div className="homeContainer">
                <div className="leftBox">
                    <LeftNav />
                    <LeftServer servername={servername} />
                </div>
                <div className="rightBox">
                    {/* Use selectedOption and servername here */}
                </div>
            </div>
            <div className="displayName"><Displayname /></div>
        </div>
    )
}
