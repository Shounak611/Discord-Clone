import { useState } from "react"
import TopNav from "../Componennts/Home/TopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftMid from "../Componennts/Home/LeftMid"
import RightBox from "../Componennts/Home/RightBox"
import './css/Home.css'

export default function Home(){
    const [selectedOption, setSelectedOption] = useState('Friends');
    
    return (
        <div className="styleHome">
            <div className="homeContainer">
                <div className="leftBox">
                    <LeftNav/>
                    <LeftMid onSelectedOption={setSelectedOption} selectedOption={selectedOption}/>
                </div>
                <div className="rightBox">
                    <TopNav selectedOption={selectedOption}/>
                    <div className="rightContent">
                        <RightBox selected={selectedOption}/>           
                    </div>
                </div>
            </div>
        </div>
    )
}