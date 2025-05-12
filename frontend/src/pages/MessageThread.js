import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../api";

function MessageThread() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const access = localStorage.getItem("access");

  useEffect(() => {
    // Fetch current user's profile
    fetch(`${API_BASE}/api/profile/`, {
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => setCurrentUser(data));

    // Fetch messages
    fetch(`${API_BASE}/api/messages/?user_id=${userId}`, {
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        // Set other user from the first message where they are either sender or receiver
        const otherUserInfo = data.find(msg => msg.sender !== currentUser?.username || msg.receiver !== currentUser?.username);
        if (otherUserInfo) {
          setOtherUser({
            username: otherUserInfo.sender !== currentUser?.username ? otherUserInfo.sender : otherUserInfo.receiver
          });
        }
      });
  }, [userId, access, currentUser?.username]);

  const handleSend = () => {
    if (!newMsg.trim()) return;

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
        // Add the new message with proper sender/receiver info
        setMessages([...messages, {
          sender: currentUser?.username,
          receiver: otherUser?.username,
          content: newMsg,
          timestamp: new Date().toISOString()
        }]);
        setNewMsg("");
      });
  };

  const isCurrentUserSender = (msg) => msg.sender === currentUser?.username;

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
      <div className="card">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '10px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            marginRight: '15px'
          }}>
            {otherUser?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <h2 style={{ margin: '0', color: 'var(--primary-color)' }}>
            {otherUser?.username || 'Loading...'}
          </h2>
        </div>

        <div style={{ 
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '15px',
          height: '400px',
          overflowY: 'auto',
          marginBottom: '20px',
          backgroundColor: 'var(--background-color)'
        }}>
          {messages.map((msg, i) => (
            <div 
              key={i}
              style={{
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isCurrentUserSender(msg) ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                backgroundColor: isCurrentUserSender(msg) ? 'var(--primary-color)' : 'white',
                color: isCurrentUserSender(msg) ? 'white' : 'var(--text-color)',
                padding: '10px 15px',
                borderRadius: '18px',
                maxWidth: '70%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                marginBottom: '5px'
              }}>
                {msg.content}
              </div>
              <small style={{ 
                color: '#666',
                fontSize: '0.8em'
              }}>
                {msg.sender} • {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'flex',
          gap: '10px'
        }}>
          <textarea
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            style={{
              flex: 1,
              minHeight: '50px',
              resize: 'none',
              borderRadius: '25px',
              padding: '15px 20px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            className="btn-primary"
            onClick={handleSend}
            style={{
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageThread;
