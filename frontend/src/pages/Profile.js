import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../api";

function Profile() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      fetch(`${API_BASE}/api/profile/`, {
        headers: {
          Authorization: "Bearer " + access,
        },
      })
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  if (!data) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '40px auto', position: 'relative' }}>
        <button 
          onClick={handleLogout}
          className="btn-danger"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>🚪</span>
          Logout
        </button>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '40px',
            marginRight: '20px'
          }}>
            {data.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)' }}>
              {data.username}
            </h2>
            <p style={{ 
              margin: '0',
              padding: '4px 12px',
              background: 'var(--background-color)',
              borderRadius: '15px',
              display: 'inline-block',
              fontSize: '0.9em'
            }}>
              {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
            </p>
          </div>
        </div>

        {data.role === "user" && (
          <>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>About</h3>
              <p style={{ 
                margin: '0',
                padding: '15px',
                background: 'var(--background-color)',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {data.bio || "No bio provided yet"}
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>Experience</h3>
              <div style={{ 
                padding: '15px',
                background: 'var(--background-color)',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {data.experience ? (
                  <div dangerouslySetInnerHTML={{ __html: data.experience.replace(/\n/g, '<br/>') }} />
                ) : (
                  "No experience listed yet"
                )}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>Education</h3>
              <div style={{ 
                padding: '15px',
                background: 'var(--background-color)',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {data.education ? (
                  <div dangerouslySetInnerHTML={{ __html: data.education.replace(/\n/g, '<br/>') }} />
                ) : (
                  "No education listed yet"
                )}
              </div>
            </div>
          </>
        )}

        <div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>Quick Actions</h3>
          
          {data.role === "user" && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <Link to="/jobs" className="nav-link">
                🔍 View Job Listings
              </Link>
              <Link to="/edit-profile" className="nav-link">
                ✏️ Edit Profile
              </Link>
              <Link to="/users" className="nav-link">
                🔗 Find People
              </Link>
              <Link to="/connections" className="nav-link">
                🔗 Incoming Requests
              </Link>
              <Link to="/my-connections" className="nav-link">
                👥 My Connections
              </Link>
              <Link to="/feed" className="nav-link">
                📝 View Feed
              </Link>
            </div>
          )}

          {data.role === "recruiter" && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <Link to="/post-job" className="nav-link">
                📢 Post a Job
              </Link>
              <Link to="/jobs" className="nav-link">
                📄 View All Jobs
              </Link>
              <Link to="/applications" className="nav-link">
                📥 View Applications
              </Link>
            </div>
          )}

          {data.role === "admin" && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <Link to="/admin" className="nav-link">
                👑 Admin Dashboard
              </Link>
              <Link to="/admin-flagged-jobs" className="nav-link">
                🚩 Flagged Jobs
              </Link>
              <Link to="/jobs" className="nav-link">
                📄 View All Jobs
              </Link>
              <Link to="/users" className="nav-link">
                👥 Manage Users
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

