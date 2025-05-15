import Qrlogo from './assets/login-page-qr-logo.png'

export default function QrCode(){
    let qrStyle={
        width: "176px",
        height: "176px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"green",
    }
    let imgStyle={
        width: "50px",
        height: "50px",
    }
    return(
        <div style={qrStyle}>
          <img style={imgStyle} src={Qrlogo} alt="Discord-logo"/>
        </div>
    )
}