import UserInfo from "./UserInfo"

export default function RegisterForm(){
    let headingStyle = {
        width: "416px",
        height: "30px",
        color: "white",
        fontFamily: "gg sans, Noto Sans, sans-serif",
        textAlign: "center",
    }
    let formStyle ={
        width: "416px",
        height: "620px",
    }
    return (
        <>
        <div style={headingStyle}>
         <h2>Create an account</h2>
        </div>
        <div style={formStyle}>
          <UserInfo text="Email" inptype="email"/>
          <UserInfo text="display name" inptype="text"/>
          <UserInfo text="username" inptype="text"/>
          <UserInfo text="password" inptype="password"/>
        </div>
        </>
    )
}