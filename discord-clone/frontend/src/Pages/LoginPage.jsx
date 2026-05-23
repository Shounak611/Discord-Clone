import { Link } from 'react-router-dom'
import './css/LoginPage.css'
import Login from '../Componennts/Login/Login'
import Discordlogo from '../assets/login-page-discord-logo.svg'

export default function LoginPage() {
    return (
        <div className='stylesLogin'>
            <div className='logoStyle'>
                <Link to="/">
                    <img src={Discordlogo} alt="Discord-logo" />
                </Link>
            </div>
            <div className='stylesFormContainer'>
               <Login/>
            </div>
        </div>
    )
}