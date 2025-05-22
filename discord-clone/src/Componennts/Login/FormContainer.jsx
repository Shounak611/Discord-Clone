import Form from "./Form"
import QrContainer from "./QrContainer"


export default function FormContainer(){
    let formStyle={
        width: "416px",
        padding: "20px"
    }
    let containerStyle={
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    }
    let qrStyle={
        height: "344px",
        width: "240px",
    }
    return (
        <div style={containerStyle}>
            <div style={formStyle}>
               <Form/>
            </div>
            <div>
                <QrContainer/>
            </div>
        </div>
    )
}