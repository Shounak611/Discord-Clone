import {Link} from "react-router-dom"
import UserInfo from "./UserInfo"
import Button from "./Button"
import LoginpageLinks from "./PageLinks"

export default function Form(){
    let formStyles={
        color: "white",
        height: "100%"
    }
    let formheadingStyle={
        textAlign: "center",
        fontFamily: "gg sans, Noto Sans, sans-serif",
    }
    return (
        <div style={formStyles}>
            <form action="post">
                <div style={formheadingStyle}>
                <h2>Welcome Back!</h2>
                <h4>We're so excited to see you again!</h4>
                </div>
                <UserInfo text ="EMAIL OR PHONE NUMBER" inptype="text" />
                <UserInfo text ="PASSWORD" inptype="password" />
                <LoginpageLinks text="Forgot your password?" linkAddress=""/>
                <Button/>
                <p style={{color:"#B9BBBE",display:"inline"}}>Need an account</p>&nbsp;&nbsp;&nbsp;
                <Link to = "/register">
                <LoginpageLinks style={{display:"inline"}} text="Register" linkAddress=""/>
                </Link>
            </form>

        </div>
    )
}