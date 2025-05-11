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
    <div>
      <h2>Job Listings</h2>
      {jobs.length === 0 && <p>No jobs available.</p>}
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{job.title}</h3>
          <p>
            <strong>Company:</strong> {job.company}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>{job.description}</p>
          <p>
            <em>Posted by {job.posted_by}</em>
          </p>

          {/* Sadece 'user' rolü için Apply butonu */}
          {profile?.role === "user" && (
  <>
    <button onClick={() => handleApply(job.id)}>Apply</button>
    <button onClick={() => handleFlag(job.id)}>🚩 Report Job</button>
  </>
)}
        </div>
      ))}
    </div>
  );
}

export default JobList;
