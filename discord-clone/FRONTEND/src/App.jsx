import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage';
import Home from './Pages/Home';
import LandingPage from './Pages/LandingPage';
import Server from './Pages/Server';
import ProtectedRoute from './protectRoutes';
import PublicRoute from './PublicRoute';

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/server/:servername' element={<ProtectedRoute><Server /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
