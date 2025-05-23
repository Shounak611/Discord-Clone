import UserInfo from "./UserInfo"
import './css/RegisterForm.css'
import Dob from "./Dob"
import Button from "./Button"
import PageLinks from "./PageLinks"

export default function RegisterForm() {
  return (
    <div className="containerStyle">
      <div className='headingStyle'>
        <h2>Create an account</h2>
      </div>
      <div className='formStyle'>
        <UserInfo text="Email" inptype="email" />
        <UserInfo text="display name" inptype="text" />
        <UserInfo text="username" inptype="text" />
        <UserInfo text="password" inptype="password" />
        <Dob />
        <div className="caution">
          <span><input className='checkBox' type="checkbox" required /></span> <h6>(Optional) It’s okay to send me emails with Discord updates, tips, and special offers. You can opt out at any time.</h6>
        </div>
        <Button text="Continue" />
        <h6>By registering, you agree to Discord's 
        <PageLinks text="Terms of Service" linkAddress="#" />
    and
        <PageLinks text="Privacy Policy" linkAddress="#" /></h6>
      </div>
      <div className="lastLink">
        <PageLinks text="Already have an account?" linkAddress="#" />
      </div>
    </div>
  )
}