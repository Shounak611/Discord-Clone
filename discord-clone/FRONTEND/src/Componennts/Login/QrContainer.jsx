import cartoon from '../../assets/inpCartoon.svg'
import LoginpageLinks from "./PageLinks"
import './css/QrContainer.css'

export default function QrContainer() {

    return (
        <div className='QrcontainerStyle'style={{display:"flex",flexDirection:"column"}}>
            <div className='imgStyle'>
                <img className='loginCartoon' src={cartoon} alt="cartoon" />
            </div>
            <div className='desStyle'>
                <h3>Log in with QR Code</h3>
                <h4>Scan this with the <b>Discord Mobile App</b> to log in instantly</h4>
                <LoginpageLinks text="Or,sign in with passkey" linkAddress="#" />
            </div>
        </div>
    )
}