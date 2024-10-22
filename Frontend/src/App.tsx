import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Chat from './components/chat'; 
import Chatbot from './components/chatbot'; 
import Dashboard from './components/dashboard';


function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav> */}
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;