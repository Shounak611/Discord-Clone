import './css/UserInfo.css'

export default function UserInfo({ text, inptype }) {
    return (
        <div className='inpcontainerStyles'>
            <label htmlFor={inptype} className='labelingStyle'>{text}</label><span style={{ color: "#F04747" }}>*</span> <br />
            <input type={inptype} className='inpboxStyle' required />
        </div>
    )
}