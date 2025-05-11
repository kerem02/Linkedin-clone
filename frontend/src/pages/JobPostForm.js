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

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Post a Job</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} /><br />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} /><br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default JobPostForm;
