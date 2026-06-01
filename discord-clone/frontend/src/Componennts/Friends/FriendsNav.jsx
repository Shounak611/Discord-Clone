import './css/FriendsNav.css';

export default function FriendsNav({ setTab, onToggleSidebar }) {
    return (
        <div className='friendNavC'>
            <div className='leftFriendsNav'>
                {/* Mobile Menu Hamburger Button */}
                <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <div className='friendsNavTitle'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p>Friends</p>
                </div>
                <div className='friendsNavBtns'>
                    <div className='lnc2' onClick={() => setTab('add')}><p>Add Friend</p></div>
                    <div className='lnc2' onClick={() => setTab('pending')}><p>Pending</p></div>
                </div>
            </div>
        </div>
    );
}
