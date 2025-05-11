import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../api";

function MessageThread() {
  const { userId } = useParams();  // URL'den receiver ID
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const access = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API_BASE}/api/messages/?user_id=${userId}`, {
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [userId]);

  const handleSend = () => {
    fetch(`${API_BASE}/api/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({
        receiver_id: userId,
        content: newMsg
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setMessages([...messages, {
          sender: "You",
          receiver: "Them",
          content: newMsg,
          timestamp: new Date().toISOString()
        }]);
        setNewMsg("");
      });
  };

  return (
    <div>
      <h2>Conversation</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.content}
            <br /><small>{new Date(msg.timestamp).toLocaleString()}</small>
            <hr />
          </div>
        ))}
      </div>
      <textarea
        placeholder="Type a message..."
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
      /><br />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default MessageThread;
