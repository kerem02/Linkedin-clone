import { useEffect, useState } from "react";
import API_BASE from "../api";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/users/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleConnect = (receiverId) => {
    const access = localStorage.getItem("access");
    fetch(`${API_BASE}/api/connect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ receiver_id: receiverId })
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  return (
    <div>
      <h2>Find People</h2>
      {users.map(user => (
        <div key={user.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>{user.username}</strong> ({user.role})</p>
          <p>{user.bio}</p>
          <button onClick={() => handleConnect(user.id)}>Connect</button>
        </div>
      ))}
    </div>
  );
}

export default UserList;
