export default function LoginpageLinks({text,linkAddress}) {
    let styles = {
        color: "#5865F2",
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