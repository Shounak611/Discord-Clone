import UserInfo from "./UserInfo"
import './css/RegisterForm.css'
import Dob from "./Dob"
import Button from "./Button"
import PageLinks from "./PageLinks"

export default function RegisterForm() {
  return (
    <div className="regformcontainerStyle">
      <div>
        <div className='regformheadingStyle'>
          <h2>Create an account</h2>
        </div>
        <div className='regformStyle'>
          <UserInfo text="Email" inptype="email" />
          <UserInfo text="display name" inptype="text" />
          <UserInfo text="username" inptype="text" />
          <UserInfo text="password" inptype="password" />
          <Dob />
        </div></div>
      <div className="lowerregform">
        <div className="caution">
          <span><input className='checkBox' type="checkbox" required /></span> <h6>(Optional) It’s okay to send me emails with Discord updates, tips, and special offers. You can opt out at any time.</h6>
        </div>
        <Button text="Continue" />
        <h6>By registering, you agree to Discord's &nbsp;&nbsp;
          <div style={{ display: "inline" }} >
            <a className='reglinkStyles' href="#">Terms of Service</a>
          </div>&nbsp;&nbsp;
          and&nbsp;&nbsp;
          <div style={{ display: "inline" }} >
            <a className='reglinkStyles' href="#">Privacy Policy</a>
          </div></h6>

        <div className="lastlink">
          <PageLinks text="Already have an account?" linkAddress="../../Pages/LoginPage.jsx" />
        </div>
      </div>
    </div>
  )
}