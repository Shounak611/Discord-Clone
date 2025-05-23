import LoginpageLinks from "./PageLinks"
import './css/QrContainer.css'
import Qrlogo from "./Qrlogo"

export default function QrContainer() {

    return (
        <div className='containerStyle'style={{display:"flex",flexDirection:"column"}}>
            <div className='imgStyle'>
                <Qrlogo/>
            </div>
            <div className='desStyle'>
                <h3>Log in with QR Code</h3>
                <h4>Scan this with the <b>Discord Mobile App</b> to log in instantly</h4>
                <LoginpageLinks text="Or,sign in with passkey" linkAddress="#" />
            </div>
        </div>
    )
}