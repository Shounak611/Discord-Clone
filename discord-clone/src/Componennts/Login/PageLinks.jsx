export default function PageLinks({text,linkAddress}) {
    let styles = {
        color: "rgb(168, 175, 245)",
        fontSize: "14px",
        textDecoration: "none",
        display: "inline",
    }
    return (
        <div style={{display:"inline"}} >
            <a style={styles} href={linkAddress}>{text}</a>
        </div>
    )
}