export default function Button() {
    let btnStyle = {
        backgroundColor: "#5865F2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "600",
        padding: "10px 0",
        width: "100%",
    }
    return (
        <>
            <button style={btnStyle} type="submit">Log In</button>
        </>
    )
}