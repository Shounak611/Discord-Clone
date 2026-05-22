import './css/LoginPage.css'
import Login from '../Componennts/Login/Login'
import Discordlogo from '../assets/login-page-discord-logo.svg'

export default function LoginPage() {
    return (
        <div className='stylesLogin'>
            <div className='logoStyle'>
                <img src={Discordlogo} alt="Discord-logo" />
            </div>
            <div className='stylesFormContainer'>
               <Login/>
            </div>
        </div>
    )
}