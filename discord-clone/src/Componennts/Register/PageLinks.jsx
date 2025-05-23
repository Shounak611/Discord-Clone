import './css/PageLinks.css'

export default function PageLinks({text,linkAddress}) {
    return (
        <div style={{display:"inline"}} >
            <a className='linkStyles' href={linkAddress}>{text}</a>
        </div>
    )
}