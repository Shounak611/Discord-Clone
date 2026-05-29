import { useState } from "react"
import TopNav from "../Componennts/Home/TopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftMid from "../Componennts/Home/LeftMid"
import RightBox from "../Componennts/Home/RightBox"
import './css/Home.css'

export default function Home(){
    const [selectedOption, setSelectedOption] = useState('Friends');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setSidebarOpen(false);
    };

    return (
        <div className="styleHome">
            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div 
                    className="sidebarOverlay" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="homeContainer">
                <div className={`leftBox ${sidebarOpen ? 'open' : ''}`}>
                    <LeftNav/>
                    <LeftMid onSelectedOption={handleSelect} selectedOption={selectedOption}/>
                </div>
                <div className="rightBox">
                    <TopNav 
                        selectedOption={selectedOption} 
                        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                    />
                    <div className="rightContent">
                        <RightBox selected={selectedOption}/>           
                    </div>
                </div>
            </div>
        </div>
    )
}