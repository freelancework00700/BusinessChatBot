import { useState } from 'react';
import '../../styles/register.css';

interface RegisterProps {
  onRegister: (email: string, password: string) => void;
}

const Register = ({ onRegister }: RegisterProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    onRegister(email, password);
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default Register;
