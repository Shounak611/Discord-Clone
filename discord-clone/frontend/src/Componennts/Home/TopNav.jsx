import user from '../../assets/userIcon.png'
import './css/TopNav.css'

export default function TopNav({ selectedOption, onToggleSidebar }) {
    let title = "Friends";
    let icon = user;

    if (selectedOption && selectedOption.startsWith("Chat:")) {
        title = selectedOption.split(":")[1];
        icon = user;
    }

    return (
        <div className="topdiv">
            <div className='left-title'>
                {/* Hamburger menu — visible only on mobile */}
                <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <img className='icon title-icon' src={icon} alt={title} />
                <p className="title-text">{title}</p>
            </div>
        </div>
    )
}