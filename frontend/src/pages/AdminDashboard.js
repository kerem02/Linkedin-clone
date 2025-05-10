import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      fetch("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: "Bearer " + access,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          if (data.role !== "admin") {
            alert("Only admins can access this page.");
            navigate("/profile");
          }
        });

      fetch("http://localhost:8000/api/admin/jobs/", {
        headers: {
          Authorization: "Bearer " + access,
        },
      })
        .then((res) => res.json())
        .then((data) => setJobs(data));
    }
  }, [navigate]);

  const handleDelete = (jobId) => {
    const access = localStorage.getItem("access");
    fetch(`http://localhost:8000/api/admin/jobs/${jobId}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + access,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      });
  };

  return (
    <div>
      <h2>Admin Job Management</h2>
      {jobs.length === 0 && <p>No jobs in the system.</p>}
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Posted by:</strong> {job.posted_by}</p>
          <button onClick={() => handleDelete(job.id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
