import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/register.css";
const API = import.meta.env.VITE_API_URL; 



const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<string>("customer"); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          type
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      setSuccess(true);
      setError(null);  
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");  
      }, 3000);
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    handleRegister();
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && (
          <div className="popup error-popup">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="popup success-popup">
            <p>Registration successful!</p>
          </div>
        )}

        <div className="input-group">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-group">
          <input
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="input-group">
          {/* <label htmlFor="userType">User Type:</label> */}
          <select
            id="userType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="customer">Customer</option>
            <option value="business_owner">Business Owner</option>
          </select>
        </div>
        <button className="register-button" type="submit">
          Register
        </button>
         {/* Link to Login Page */}
         <p className="login-link">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")} >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;