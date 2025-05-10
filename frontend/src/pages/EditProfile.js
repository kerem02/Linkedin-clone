import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch("http://localhost:8000/api/profile/", {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setBio(data.bio || "");
        setExperience(data.experience || "");
        setEducation(data.education || "");
      });
  }, []);

  const handleSubmit = () => {
    const access = localStorage.getItem("access");

    fetch("http://localhost:8000/api/update-profile/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ bio, experience, education })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        navigate("/profile");
      });
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      /><br />
      <textarea
        placeholder="Experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      /><br />
      <textarea
        placeholder="Education"
        value={education}
        onChange={(e) => setEducation(e.target.value)}
      /><br />
      <button onClick={handleSubmit}>Save Changes</button>
    </div>
  );
}

export default EditProfile;
