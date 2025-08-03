import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("email");
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return children;
}
