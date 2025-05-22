import './css/LoginPage.css'
import FormContainer from '../Componennts/Login/FormContainer'
import Discordlogo from '../assets/login-page-discord-logo.svg'

export default function LoginPage() {
    return (
        <div className='stylesLogin'>
            <div className='logoStyle'>
                <img src={Discordlogo} alt="Discord-logo" />
            </div>
            <div className='stylesFormContainer'>
               <FormContainer/>
            </div>
        </div>
    )
}