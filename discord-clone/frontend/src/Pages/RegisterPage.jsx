import Discordlogo from '../assets/login-page-discord-logo.svg'
import RegisterForm from '../Componennts/Register/RegisterForm'
import './css/RegisterPage.css'

export default function RegisterPage() {
    return (
        <div className='stylesRegister'>
            <div className='logoStyle'>
                <img src={Discordlogo} alt="Discord-logo" />
            </div>
            <div className='stylesRegisterForm'>
                <RegisterForm/>
            </div>
        </div>
    )
}