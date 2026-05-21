import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const email = localStorage.getItem("email");

    return email ? children : <Navigate to="/login" />;
}
