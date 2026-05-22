import Discordlogo from '../assets/login-page-discord-logo.svg'
import Register from '../Componennts/Register/Register'
import './css/RegisterPage.css'

export default function RegisterPage() {
    return (
        <div className='stylesRegister'>
            <div className='logoStyle'>
                <img src={Discordlogo} alt="Discord-logo" />
            </div>
            <div className='stylesRegisterForm'>
                <Register/>
            </div>
        </div>
    )
}