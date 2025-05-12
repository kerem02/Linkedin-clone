import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../api";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      Promise.all([
        fetch(`${API_BASE}/api/profile/`, {
          headers: {
            Authorization: "Bearer " + access,
          },
        }).then((res) => res.json()),
        fetch(`${API_BASE}/api/admin/jobs/`, {
          headers: {
            Authorization: "Bearer " + access,
          },
        }).then((res) => res.json())
      ])
        .then(([profileData, jobsData]) => {
          if (profileData.role !== "admin") {
            navigate("/profile");
            return;
          }
          setProfile(profileData);
          setJobs(jobsData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [navigate]);

  const handleDelete = (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/admin/jobs/${jobId}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + access,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      });
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '1000px', padding: '40px 20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '40px 20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          color: 'var(--primary-color)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>👑</span> Admin Dashboard
        </h2>
        <Link 
          to="/admin-flagged-jobs"
          className="btn-warning"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>🚩</span> View Flagged Jobs
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ margin: '0', color: '#666' }}>No jobs in the system.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 10px 0',
                    color: 'var(--primary-color)'
                  }}>
                    {job.title}
                  </h3>
                  <p style={{ 
                    margin: '5px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>🏢</span>
                    <strong>Company:</strong> {job.company}
                  </p>
                  <p style={{ 
                    margin: '5px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>👤</span>
                    <strong>Posted by:</strong> {job.posted_by}
                  </p>
                  <p style={{ 
                    margin: '5px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>📅</span>
                    <strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  {job.location && (
                    <p style={{ 
                      margin: '5px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>📍</span>
                      <strong>Location:</strong> {job.location}
                    </p>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="btn-danger"
                    style={{ 
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>🗑</span> Delete
                  </button>
                  <Link 
                    to={`/jobs/${job.id}`}
                    className="btn-primary"
                    style={{ 
                      padding: '5px 10px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}
                  >
                    <span>👁️</span> View
                  </Link>
                  <Link 
                    to={`/jobs/${job.id}/edit`}
                    className="btn-warning"
                    style={{ 
                      padding: '5px 10px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}
                  >
                    <span>✏️</span> Edit
                  </Link>
                </div>
              </div>
              <div style={{
                padding: '10px',
                background: 'var(--background-color)',
                borderRadius: '8px',
                marginTop: '10px'
              }}>
                <p style={{ 
                  margin: '0',
                  fontSize: '0.9em',
                  lineHeight: '1.5'
                }}>
                  {job.description?.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
