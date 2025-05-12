import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../api";

function MyConnections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/connections/accepted/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => setConnections(data));
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        marginBottom: '30px'
      }}>
        My Connections
      </h2>

      {connections.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ margin: '0', color: '#666' }}>No connections yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {connections.map(conn => (
            <Link 
              key={conn.id} 
              to={`/messages/${conn.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  {conn.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 5px 0',
                    color: 'var(--text-color)'
                  }}>
                    {conn.username}
                  </h3>
                  <span style={{ 
                    color: 'var(--primary-color)',
                    fontSize: '0.9em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>💬</span> Send Message
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyConnections;
