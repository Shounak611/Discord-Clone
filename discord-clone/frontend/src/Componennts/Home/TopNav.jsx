import help from '../../assets/helpIcon.png'
import user from '../../assets/userIcon.png'
import nitro from '../../assets/nitroIcon.png'
import shop from '../../assets/shopIcon.png'
import inbox from '../../assets/inboxIcon.png'
import './css/TopNav.css'

export default function TopNav({ selectedOption }) {
    let title = "Friends";
    let icon = user;

    if (selectedOption === "Nitro") {
        title = "Nitro";
        icon = nitro;
    } else if (selectedOption === "Shop") {
        title = "Shop";
        icon = shop;
    } else if (selectedOption && selectedOption.startsWith("Chat:")) {
        title = selectedOption.split(":")[1];
        icon = user;
    }

    return (
        <div className="topdiv">
            <div className='left-title'>
                <img className='icon title-icon' src={icon} alt={title} />
                <p className="title-text">{title}</p>
            </div>
            <div className='right'>
                <img className="icon" src={inbox} alt="inbox" />
                <img className='icon' src={help} alt="help" />
            </div>
        </div>
    )
}