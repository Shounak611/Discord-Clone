import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage';
import Home from './Pages/Home';
import ProtectedRoute from './protectRoutes';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
