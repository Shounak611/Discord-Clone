import './css/Button.css'
export default function Button({text}) {
    return (
        <>
            <button className="btnStyle" type="submit">{text}</button>
        </>
    )
}