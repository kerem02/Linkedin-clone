import { useEffect, useState } from "react";
import API_BASE from "../api";

function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/connections/incoming/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = (id, action) => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/connections/incoming/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ connection_id: id, action })
    })
      .then(res => res.json())
      .then(data => {
        setRequests(prev => prev.filter(r => r.id !== id));
      });
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        marginBottom: '30px'
      }}>
        Connection Requests
      </h2>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ margin: '0', color: '#666' }}>No new connection requests</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {requests.map(req => (
            <div key={req.id} className="card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
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
                  marginRight: '15px'
                }}>
                  {req.sender_username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{req.sender_username}</h3>
                  <p style={{ 
                    margin: '0',
                    color: '#666',
                    fontSize: '0.9em'
                  }}>
                    wants to connect with you
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                gap: '10px'
              }}>
                <button 
                  className="btn-primary"
                  onClick={() => handleAction(req.id, "accept")}
                  style={{ flex: 1 }}
                >
                  ✅ Accept
                </button>
                <button 
                  onClick={() => handleAction(req.id, "reject")}
                  style={{ flex: 1 }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConnectionRequests;
