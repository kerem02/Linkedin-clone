import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      fetch("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: "Bearer " + access
        }
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          if (data.role !== "recruiter") {
            alert("Only recruiters can view this page.");
            navigate("/profile");
          }
        });

      fetch("http://localhost:8000/api/applications/", {
        headers: {
          Authorization: "Bearer " + access
        }
      })
        .then(res => res.json())
        .then(data => setApplications(data));
    }
  }, [navigate]);

  return (
    <div>
      <h2>Applications to Your Job Posts</h2>
      {applications.length === 0 && <p>No applications yet.</p>}
      <ul>
        {applications.map((app, index) => (
          <li key={index}>
            <strong>{app.applicant}</strong> applied to <em>{app.job_title}</em> at{" "}
            {new Date(app.applied_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Applications;
