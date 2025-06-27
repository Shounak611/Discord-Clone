import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage';
import Home from './Pages/Home';
import LandingPage from './Pages/LandingPage';
import Server from './Pages/Server';
import ProtectedRoute from './protectRoutes';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/server/:servername' element={<ProtectedRoute><Server/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
