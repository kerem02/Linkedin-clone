import { useEffect, useState } from "react";
import API_BASE from "../api";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access");

    // Kullanıcı profilini çek
    if (access) {
      fetch(`${API_BASE}/api/profile/`, {
        headers: {
          Authorization: "Bearer " + access,
        },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data));
    }

    // Job ilanlarını çek
    fetch(`${API_BASE}/api/job-list/`)
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);


  const [role, setRole] = useState("");

useEffect(() => {
  fetch(`${API_BASE}/api/profile/`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("access") }
  })
    .then(res => res.json())
    .then(data => setRole(data.role));
}, []);

  const handleFlag = (jobId) => {
  fetch(`${API_BASE}/api/jobs/${jobId}/flag/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access")
    }
  })
    .then(res => res.json())
    .then(data => alert(data.message));
};

  // Başvuru gönderme fonksiyonu
  const handleApply = (jobId) => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/apply/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access,
      },
      body: JSON.stringify({ job_id: jobId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      });
  };

  return (
    <div className="container">
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        marginBottom: '30px'
      }}>
        Job Listings
      </h2>
      
      {jobs.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No jobs available.</p>
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <h3 style={{ 
              color: 'var(--primary-color)',
              marginTop: 0
            }}>
              {job.title}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ 
                margin: '5px 0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🏢</span>
                <strong>Company:</strong> {job.company}
              </p>
              <p style={{ 
                margin: '5px 0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>📍</span>
                <strong>Location:</strong> {job.location}
              </p>
            </div>
            
            <p style={{ 
              margin: '15px 0',
              padding: '10px',
              background: 'var(--background-color)',
              borderRadius: '4px'
            }}>
              {job.description}
            </p>
            
            <p style={{ 
              fontSize: '0.9em',
              color: '#666',
              fontStyle: 'italic',
              marginBottom: '15px'
            }}>
              Posted by {job.posted_by}
            </p>

            {profile?.role === "user" && (
              <div style={{ 
                display: 'flex',
                gap: '10px',
                marginTop: 'auto'
              }}>
                <button 
                  className="btn-primary"
                  onClick={() => handleApply(job.id)}
                  style={{ flex: 1 }}
                >
                  Apply Now
                </button>
                <button 
                  className="btn-warning"
                  onClick={() => handleFlag(job.id)}
                  style={{ flex: 0 }}
                >
                  🚩
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
