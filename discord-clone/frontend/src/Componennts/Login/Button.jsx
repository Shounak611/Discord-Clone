import './css/Button.css'

export default function Button({text,onClick}) {
    return (
        <>
            <button className='btnStyle' type="submit" onClick={onClick}>{text}</button>
        </>
    )
}