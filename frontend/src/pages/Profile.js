import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API_BASE from "../api";


function Profile() {
  const [data, setData] = useState(null);
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
          // örnek otomatik yönlendirme (isteğe bağlı):
          // if (profile.role === "admin") navigate("/admin");
        });
    }
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
      <div>
        <h2>Welcome, {data.username}</h2>
        <p>Your role: {data.role}</p>

        {data.bio && <p><strong>Bio:</strong> {data.bio}</p>}
        {data.experience && <p><strong>Experience:</strong> {data.experience}</p>}
        {data.education && <p><strong>Education:</strong> {data.education}</p>}
        <div>
          <button onClick={() => {
          localStorage.removeItem("access");
          navigate("/");
          }}>
            🚪 Logout
         </button>
        </div>

  {
    data.role === "user" && (
        <div>
          <p>🧍 You can apply to jobs.</p>
        </div>
    )
  }

  {
    data.role === "recruiter" && (
        <div>
          <p>🏢 You can post new jobs.</p>
        </div>
    )
  }

  {
    data.role === "admin" && (
        <div>
          <p>🛠 You have admin access.</p>
          <Link to="/admin">🛠 Go to Admin Panel</Link>
            <Link to="/admin-flagged-jobs">🚨 View Flagged Jobs</Link>

        </div>
    )
  }
  {/* 🔗 Rol bazlı linkler */
  }
  {
    data.role === "user" && (
        <div>
            <Link to="/jobs">🔍 View Job Listings</Link><br />
            <Link to="/edit-profile">✏️ Edit Profile</Link><br />
            <Link to="/users">🔗 Find People</Link><br />
            <Link to="/connections">🔗 Incoming Requests</Link><br />
            <Link to="/my-connections">👥 My Connections</Link><br />
            <Link to="/feed">📝 View Feed</Link>



        </div>
    )
  }

  {
    data.role === "recruiter" && (
          <div>
              <Link to="/post-job">📢 Post a Job</Link><br/>
              <Link to="/jobs">📄 View All Jobs</Link><br/>
              <Link to="/applications">📥 View Applications</Link><br/>
          </div>
      )
  }
</div>
  );
}


export default Profile;

