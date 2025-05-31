import './css/PageLinks.css'
import { Link } from 'react-router-dom';

export default function PageLinks({ text, linkAddress, style = {} }) {
    return (
        <Link className='linkStyles' to={linkAddress}>
            {text}
        </Link>
    );
}