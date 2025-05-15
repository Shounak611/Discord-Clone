import LoginPageBg from './assets/login-page-bg.svg'
import FormContainer from './FormContainer'
import Discordlogo from './assets/login-page-discord-logo.svg'

export default function LoginPage() {
    let stylesLogin= {
        backgroundImage: `url(${LoginPageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        display :"flex",
        justifyContent: "center",
        alignItems: "center",
    }
    let styles={
        width:"784px",
        height: "416px",
        backgroundColor: "#36393F",
        borderRadius: "10px",
    }
    let logoStyle={
        position: "absolute",
        top: "50px",
        left: "50px"
    }
    return (
        <div style={stylesLogin}>
            <div style={logoStyle}>
                <img src={Discordlogo} alt="Discord-logo" />
            </div>
            <div style={styles}>
               <FormContainer/>
            </div>
        </div>
    )
}