export default function UserInfo({ text, inptype }) {
    let styles = {
        width: "416px",
        height: "72px",
        color: "white",
    }
    let inpboxStyle = {
        backgroundColor: "#1E1F22",
        color: "white",
        border: "1px solid #1E1F22",
        borderRadius: "8px",
        padding: "10px 0px",
        fontSize: "16px",
        width: "100%",
    }
    let labelingStyle = {
        width: "416px",
        height: "24px",
        color: "#FFFFFF",
        fontFamily: "gg sans, Noto Sans, sans-serif",
        textTransform: "uppercase",
        marginBottom: "5px",
    }
    return (
        <div style={styles}>
            <label style={labelingStyle}>{text}</label><span style={{ color: "#F04747" }}>*</span> <br />
            <input type={inptype} style={inpboxStyle} required />
        </div>
    )
}