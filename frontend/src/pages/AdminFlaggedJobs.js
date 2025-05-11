import { useEffect, useState } from "react";
import API_BASE from "../api";

function AdminFlaggedJobs() {
  const [jobs, setJobs] = useState([]);

  const access = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/jobs/`, {
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const handleDelete = (jobId) => {
    fetch(`${API_BASE}/api/admin/jobs/${jobId}/`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setJobs(prev => prev.filter(j => j.id !== jobId));
      });
  };

  return (
    <div>
      <h2>🚨 Flagged Job Posts</h2>
      {jobs.length === 0 ? (
        <p>No flagged jobs found.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} style={{ border: "1px solid red", margin: "10px", padding: "10px" }}>
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Posted by:</strong> {job.posted_by}</p>
            <button onClick={() => handleDelete(job.id)} style={{ backgroundColor: "red", color: "white" }}>
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}


export default AdminFlaggedJobs;
