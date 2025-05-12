import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/profile/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setBio(data.bio || "");
        setExperience(data.experience || "");
        setEducation(data.education || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/update-profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ bio, experience, education })
    })
      .then((res) => res.json())
      .then((data) => {
        navigate("/profile");
      });
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          Loading...
        </div>
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
          Edit Your Profile
        </h2>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-color)',
            fontWeight: '500'
          }}>
            Bio
          </label>
          <textarea
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-color)',
            fontWeight: '500'
          }}>
            Experience
          </label>
          <textarea
            placeholder="Share your work experience..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{
              minHeight: '150px'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-color)',
            fontWeight: '500'
          }}>
            Education
          </label>
          <textarea
            placeholder="List your educational background..."
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            style={{
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ 
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button 
            className="btn-primary"
            onClick={handleSubmit}
            style={{ minWidth: '150px' }}
          >
            💾 Save Changes
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

export default EditProfile;
