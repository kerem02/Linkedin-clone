import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default olarak "user"
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/api/register/`, {
        username,
        password,
        role,
      });
      alert("Registration successful. Please login.");
      navigate("/"); // login sayfasına yönlendir
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>Create Account</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="user">User</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleRegister}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          Create Account
        </button>

        <p style={{ textAlign: 'center', margin: '0' }}>
          Already have an account? <Link to="/">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
