import { useState } from 'react';
import Login from './components/auth/login';
import Register from './components/auth/register';

interface AuthProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const handleLogin = (email: string, password: string): void => {
    console.log('Logged in with:', email, password);
  };

  const handleRegister = (email: string, password: string): void => {
    console.log('Registered with:', email, password);
  };

  return (
    <div>
      {isLogin ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Register onRegister={handleRegister} />
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default App;
