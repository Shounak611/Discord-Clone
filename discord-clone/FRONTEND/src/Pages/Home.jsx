import { useState } from "react"
import TopNav from "../Componennts/Home/TopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftMid from "../Componennts/Home/LeftMid"
import RightBox from "../Componennts/Home/RightBox"
import Displayname from "../Componennts/Home/Displayname"
import './css/Home.css'


export default function Home(){
    const [selectedOption, setSelectedOption] = useState('Friends')

    return (
        <div className="styleHome">
            <TopNav/>
            <div className="homeContainer">
                <div className="leftBox">
                    <LeftNav/>
                    <LeftMid onSelectedOption={setSelectedOption}/>
                </div>
                <div className="rightBox">
                    <RightBox selected={selectedOption}/>           
                </div>
            </div>
            <div className="displayName"><Displayname/></div>
        </div>
    )
}