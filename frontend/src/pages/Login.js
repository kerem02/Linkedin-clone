import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API_BASE from "../api";


function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/login/`, {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      setUser({ username });  // sahte kullanıcı bilgisi
      alert("Login successful");
      navigate("/profile");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
      <div>
          <h2>Login</h2>
          <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          /><br/>
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          /><br/>
          <button onClick={handleLogin}>Login</button>

          <p>
              Don't have an account? <Link to="/register">Register here</Link>
          </p>

      </div>
  );
}

export default Login;
