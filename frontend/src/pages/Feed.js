import { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import API_BASE from "../api";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);

  const access = localStorage.getItem("access");

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = () => {
    if (!editedContent.trim()) return;
    
    fetch(`${API_BASE}/api/posts/${editingPostId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ content: editedContent })
    })
      .then(res => res.json())
      .then(data => {
        setPosts(prev =>
          prev.map(p => p.id === editingPostId ? { ...p, content: data.content } : p)
        );
        setEditingPostId(null);
        setEditedContent("");
      });
  };

  const handleDelete = (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    fetch(`${API_BASE}/api/posts/${postId}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then((res) => {
        if (res.status === 204) {
          setPosts(prev => prev.filter(p => p.id !== postId));
        }
      });
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    Promise.all([
      // Fetch posts
      fetch(`${API_BASE}/api/posts/`, {
        headers: { Authorization: "Bearer " + access }
      }).then(res => res.json()),
      // Fetch current user profile
      fetch(`${API_BASE}/api/profile/`, {
        headers: { Authorization: "Bearer " + access }
      }).then(res => res.json())
    ])
      .then(([postsData, profileData]) => {
        setPosts(postsData);
        setCurrentUser(profileData.username);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;

    fetch(`${API_BASE}/api/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ content: newPost })
    })
      .then(res => res.json())
      .then(data => {
        setPosts([{
          id: data.id,
          user: data.user,
          content: data.content,
          created_at: data.created_at
        }, ...posts]);
        setNewPost("");
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
      <h2 style={{ 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <span>📰</span> Your Feed
      </h2>

      <div className="card" style={{ marginBottom: '30px' }}>
        <textarea
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          style={{
            minHeight: '100px',
            marginBottom: '15px'
          }}
        />
        <button 
          className="btn-primary"
          onClick={handlePost}
          style={{ width: '100%' }}
        >
          📝 Share Post
        </button>
      </div>

      {posts.map((post, index) => (
        <div key={index} className="card" style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px'
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
              {post.user.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{post.user}</h3>
              <small style={{ color: '#666' }}>
                {new Date(post.created_at).toLocaleString()}
              </small>
            </div>
            {post.user === currentUser && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(post)}
                  style={{ padding: '5px 10px' }}
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="btn-danger"
                  style={{ padding: '5px 10px' }}
                >
                  🗑
                </button>
              </div>
            )}
          </div>

          {editingPostId === post.id ? (
            <div style={{ marginBottom: '15px' }}>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary"
                  onClick={handleSaveEdit}
                  style={{ flex: 1 }}
                >
                  💾 Save
                </button>
                <button 
                  onClick={() => setEditingPostId(null)}
                  style={{ flex: 1 }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={{ 
              margin: '15px 0',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {post.content}
            </p>
          )}

          <div style={{ 
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)'
          }}>
            {post.id && <CommentSection postId={post.id} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
