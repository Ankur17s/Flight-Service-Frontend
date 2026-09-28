import { Navigate, Route, Routes } from 'react-router-dom'
import { hasAuthToken } from './common/auth/authStorage'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'

function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={hasAuthToken() ? <Home /> : <Navigate to="/login" replace />} />
    <Route path="/" element={<Navigate to={hasAuthToken() ? '/home' : '/login'} replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
}

export default App
