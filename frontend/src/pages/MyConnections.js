import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyConnections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const access = localStorage.getItem("access");

    fetch("http://localhost:8000/api/connections/accepted/", {
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then(res => res.json())
      .then(data => setConnections(data));
  }, []);

  return (
    <div>
      <h2>My Connections</h2>
      {connections.length === 0 && <p>No connections yet.</p>}
      <ul>
        {connections.map(conn => (
            <li key={conn.id}>
                <Link to={`/messages/${conn.id}`}>{conn.username}</Link>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default MyConnections;
