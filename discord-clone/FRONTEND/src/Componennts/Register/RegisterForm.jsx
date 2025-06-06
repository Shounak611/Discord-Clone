import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from "./UserInfo";
import './css/RegisterForm.css';
import Dob from "./Dob";
import Button from "./Button";
import PageLinks from "./PageLinks";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dobString = `${dob.year}-${dob.month.toString().padStart(2, "0")}-${dob.day.toString().padStart(2, "0")}`;
    try {
      const res = await axios.post("http://localhost:8000/register/registration", {
        email: email,
        display_name: displayName,
        username: username,
        password: password,
        dob: dobString,
      });
      alert("Registration successful!");
      localStorage.setItem("email",email);
      navigate("/home");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        const message = Array.isArray(detail)
          ? detail.map(e => e.msg).join("\n")
          : detail;
        alert("Registration failed:\n" + message);
      } else {
        alert("Registration failed: " + err.message);
      }
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="regformcontainerStyle">
        <div>
          <div className='regformheadingStyle'>
            <h2>Create an account</h2>
          </div>
          <div className='regformStyle'>
            <UserInfo text="Email" inptype="email" value={email} onChange={setEmail} />
            <UserInfo text="Display Name" inptype="text" value={displayName} onChange={setDisplayName} />
            <UserInfo text="Username" inptype="text" value={username} onChange={setUsername} />
            <UserInfo text="Password" inptype="password" value={password} onChange={setPassword} />
            <Dob dob={dob} setDob={setDob} />
          </div>
        </div>
        <div className="lowerregform">
          <div className="caution">
            <span><input className='checkBox' type="checkbox" /></span>
            <h6>(Optional) It’s okay to send me emails with Discord updates, tips, and special offers.</h6>
          </div>
          <Button text="Continue" />
          <h6>By registering, you agree to Discord's&nbsp;
            <a className='reglinkStyles' href="#">Terms of Service</a> &nbsp;and&nbsp;
            <a className='reglinkStyles' href="#">Privacy Policy</a>
          </h6>
          <div className="lastlink">
            <PageLinks text="Already have an account?" linkAddress="/login" />
          </div>
        </div>
      </div>
    </form>
  );
}
