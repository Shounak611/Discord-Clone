import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
