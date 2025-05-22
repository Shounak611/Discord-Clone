import UserInfo from "./UserInfo"
import './css/RegisterForm.css'

export default function RegisterForm(){
    return (
        <>
        <div className='headingStyle'>
         <h2>Create an account</h2>
        </div>
        <div className='formStyle'>
          <UserInfo text="Email" inptype="email"/>
          <UserInfo text="display name" inptype="text"/>
          <UserInfo text="username" inptype="text"/>
          <UserInfo text="password" inptype="password"/>
        </div>
        </>
    )
}