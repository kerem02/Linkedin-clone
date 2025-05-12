import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";

function JobPostForm() {
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      fetch(`${API_BASE}/api/profile/`, {
        headers: {
          Authorization: "Bearer " + access
        }
      })
        .then(res => res.json())
        .then(profile => {
          setData(profile);
          if (profile.role !== "recruiter") {
            alert("Only recruiters can access this page.");
            navigate("/profile");
          }
        });
    }
  }, [navigate]);

  const handleSubmit = () => {
    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ title, description, company, location })
    })
      .then(res => res.json())
      .then(res => {
        alert("Job posted!");
        navigate("/profile");
      })
      .catch(() => alert("Job post failed."));
  };

  if (!data) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
      <div className="card">
        <h2 style={{ 
          textAlign: 'center', 
          color: 'var(--primary-color)',
          marginBottom: '30px'
        }}>
          Post a New Job
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <input 
            placeholder="Job Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <textarea 
            placeholder="Job Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            style={{
              minHeight: '150px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input 
            placeholder="Company Name" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <input 
            placeholder="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            style={{ minWidth: '150px' }}
          >
            Post Job
          </button>
          <button 
            onClick={() => navigate('/profile')}
            style={{ minWidth: '150px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobPostForm;
