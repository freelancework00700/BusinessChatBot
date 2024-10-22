import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        email: data.data.user.email,
        id: data.data.user.id,
        type: data.data.user.type,
      };
      localStorage.setItem("token", data.data.jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && (
          <div className="popup error-popup">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="popup success-popup">
            <p>Login successful!</p>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
        <p className="register-link">
          Don't have an account?{" "}
          <a onClick={() => navigate("/register")}>Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
