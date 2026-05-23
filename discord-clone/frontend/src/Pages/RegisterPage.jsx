import { Link } from 'react-router-dom'
import Discordlogo from '../assets/login-page-discord-logo.svg'
import Register from '../Componennts/Register/Register'
import './css/RegisterPage.css'

export default function RegisterPage() {
    return (
        <div className='stylesRegister'>
            <div className='logoStyle'>
                <Link to="/">
                    <img src={Discordlogo} alt="Discord-logo" />
                </Link>
            </div>
            <div className='stylesRegisterForm'>
                <Register/>
            </div>
        </div>
    )
}