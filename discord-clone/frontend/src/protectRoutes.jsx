import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    let email = localStorage.getItem("email");

    /*
    if (!email) {
        // Automatically seed mock credentials for development to avoid logging in every time
        localStorage.setItem("email", "shounak@example.com");
        localStorage.setItem("user_id", "1");
        localStorage.setItem("username", "Shounak");
        localStorage.setItem("token", "mock_token");
        email = "shounak@example.com";
    }
    */

    return email ? children : <Navigate to="/login" />;
}
