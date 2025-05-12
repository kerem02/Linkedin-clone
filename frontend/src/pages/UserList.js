import { useEffect, useState } from "react";
import API_BASE from "../api";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/users/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleConnect = (receiverId) => {
    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/connect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ receiver_id: receiverId })
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        marginBottom: '30px'
      }}>
        Find People
      </h2>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {users.map(user => (
          <div key={user.id} className="card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
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
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{user.username}</h3>
                <span style={{ 
                  background: 'var(--background-color)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.9em'
                }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>

            <p style={{ 
              margin: '15px 0',
              padding: '10px',
              background: 'var(--background-color)',
              borderRadius: '4px',
              minHeight: '60px'
            }}>
              {user.bio || "No bio provided"}
            </p>

            <button 
              className="btn-primary"
              onClick={() => handleConnect(user.id)}
              style={{ width: '100%' }}
            >
              🤝 Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
