import Form from "./Form"
import QrContainer from "./QrContainer"
import './css/FormContainer.css'

export default function FormContainer(){
    return (
        <div className='formcontainerStyle'>
            <div className='formStyle'>
               <Form/>
            </div>
            <div className="qrStyle">
                <QrContainer/>
            </div>
        </div>
    )
}