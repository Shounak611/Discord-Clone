import './css/UserInfo.css'

export default function UserInfo({ text,value, inptype,onChange }) {
    return (
        <div className='containerStyles'>
            <label className='labelingStyle'>{text}</label><span style={{ color: "#F04747" }}>*</span> <br />
            <input type={inptype} value={value} onChange={(e) => onChange(e.target.value)} className='inpboxStyle' required />
        </div>
    )
}