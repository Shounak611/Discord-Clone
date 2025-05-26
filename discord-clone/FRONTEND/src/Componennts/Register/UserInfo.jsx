import './css/UserInfo.css'

export default function UserInfo({ text, inptype,value,onChange }) {
    return (
        <div className='inpcontainerStyles'>
            <label htmlFor={inptype} className='labelingStyle'>{text}</label><span style={{ color: "#F04747" }}>*</span> <br />
            <input type={inptype} value={value}  onChange={(e) => onChange(e.target.value)} className='inpboxStyle' required />
        </div>
    )
}