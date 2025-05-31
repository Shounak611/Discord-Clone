import './css/Logout.css'
import { useNavigate } from 'react-router-dom';

export default function Logout(){
    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem("email");
        navigate("/login");
    }

    return(
        <div onClick={handleLogout} className='logoutC'>Log out</div>
    )
}