import QrCode from "./QrCode"
import LoginpageLinks from "./LoginpageLinks"

export default function QrContainer(){
    let containerStyle={
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "gg sans, Noto Sans, sans-serif",
    }
    let desStyle={
        width: "240px",
        color: "white",
        textAlign: "center",
    }
    return (
        <div style={containerStyle}>
        <div>
            <QrCode/>
            
        </div>
        <div style={desStyle}>
        <h3>Log in with QR Code</h3>
        <h4>Scan this with the <b>Discord Mobile App</b> to log in instantly</h4>
        <LoginpageLinks text="Or,sign in with passkey" linkAddress=" "/>
        </div>
        </div>
    )
}