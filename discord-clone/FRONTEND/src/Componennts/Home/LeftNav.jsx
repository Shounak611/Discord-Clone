import discord from '../../assets/discordIcon.png'
import add from '../../assets/addIcon.png'
import discovery from '../../assets/discoveryIcon.png'
import download from '../../assets/downloadIcon.png'
import './css/LeftNav.css'

export default function LeftNav(){
    return(
        <div className="leftnavC">
            <ul className='leftnavul'>
                <li><div className='elD'><img className='liIcon' src={discord} alt="discordIcon" /></div></li>
                <li><div className='el'><img className='liIcon' src={add} alt="addIcon" /></div></li>
                <li><div className='el'><img className='liIcon' src={discovery} alt="discoveryIcon" /></div></li>
                <li><div className='el'><img className='liIcon' src={download} alt="downloadIcon" /></div></li>
            </ul>
        </div>
    )
}