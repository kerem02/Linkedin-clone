import { useEffect, useState } from "react";
import API_BASE from "../api";

function ConnectionRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/connections/incoming/`, {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  const handleAction = (id, action) => {
    const access = localStorage.getItem("access");

    fetch(`${API_BASE}/api/connections/incoming/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ connection_id: id, action })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setRequests(prev => prev.filter(r => r.id !== id));
      });
  };

  return (
    <div>
      <h2>Incoming Connection Requests</h2>
      {requests.length === 0 && <p>No new requests.</p>}
      {requests.map(req => (
        <div key={req.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>{req.sender_username}</strong> wants to connect.</p>
          <button onClick={() => handleAction(req.id, "accept")}>✅ Accept</button>
          <button onClick={() => handleAction(req.id, "reject")}>❌ Reject</button>
        </div>
      ))}
    </div>
  );
}

export default ConnectionRequests;
