export default function Form(){
    let formStyles={
        color: "white",
        textAlign: "center",
    }
    return (
        <div style={formStyles}>
            <form action="post">
                <h2>Welcome Back!</h2>
                <h4>We're so excited to see you again!</h4>
                <h5>EMAIL OR PHONE NUMBER* </h5>
                <input type="text" />
                
            </form>
        </div>
    )
}