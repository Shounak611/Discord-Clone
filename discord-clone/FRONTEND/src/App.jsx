import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage';
import Home from './Pages/Home';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
