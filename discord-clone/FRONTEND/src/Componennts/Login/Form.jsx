import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import UserInfo from "./UserInfo"
import Button from "./Button"
import LoginpageLinks from "./PageLinks"
import './css/Form.css'
import axios from "axios";


export default function Form() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/login", {
                email:mail,
                password:password,
            })
            alert("Login successful!");
            localStorage.setItem("email",mail);
            navigate("/home");
        } catch (err) {
            alert("Login failed!!" );
            console.log(err);
        }
    };

    return (
        <div className='formStyles'>
            <form onSubmit={handleSubmit}>
                <div className='formheadingStyle'>
                    <h2>Welcome Back!</h2>
                    <h4>We're so excited to see you again!</h4>
                </div>
                <UserInfo text="EMAIL OR PHONE NUMBER" value={mail} inptype="email" onChange={setMail}/>
                <UserInfo text="PASSWORD" value={password} inptype="password" onChange={setPassword} />
                <LoginpageLinks text="Forgot your password?" linkAddress="#" />
                <Button text="Log in"/>
                <p style={{ color: "#B9BBBE", display: "inline" }}>Need an account</p>&nbsp;&nbsp;&nbsp;
                <Link to="/register">
                    <LoginpageLinks style={{ display: "inline" }} text="Register" linkAddress="#" />
                </Link>
            </form>

        </div>
    )
}