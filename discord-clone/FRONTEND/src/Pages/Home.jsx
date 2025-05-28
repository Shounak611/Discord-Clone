import TopNav from "../Componennts/Home/TopNav"
import LeftNav from "../Componennts/Home/LeftNav"
import LeftMid from "../Componennts/Home/LeftMid"
import RightBox from "../Componennts/Home/RightBox"
import './css/Home.css'


export default function Home(){
    return (
        <div className="styleHome">
            <TopNav/>
            <div className="homeContainer">
                <div className="leftBox">
                    <LeftNav/>
                    <LeftMid/>
                </div>
                <div className="rightBox">
                    <RightBox/>           
                </div>
            </div>
        </div>
    )
}