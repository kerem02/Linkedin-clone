import { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");




  const access = localStorage.getItem("access");



    const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditedContent(post.content);
    };

    const handleSaveEdit = () => {
  fetch(`http://localhost:8000/api/posts/${editingPostId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access
    },
    body: JSON.stringify({ content: editedContent })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setPosts(prev =>
        prev.map(p => p.id === editingPostId ? { ...p, content: data.content } : p)
      );
      setEditingPostId(null);
      setEditedContent("");
    });
};

    const handleDelete = (postId) => {
    fetch(`http://localhost:8000/api/posts/${postId}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + access
      }
    })
      .then((res) => {
        if (res.status === 204) {
          alert("Post deleted");
          setPosts(prev => prev.filter(p => p.id !== postId));
        } else {
          alert("Delete failed");
        }
      });
  };

  useEffect(() => {
  const access = localStorage.getItem("access");

  // Fetch posts
  fetch("http://localhost:8000/api/posts/", {
    headers: { Authorization: "Bearer " + access }
  })
    .then(res => res.json())
    .then(data => setPosts(data));

  // Fetch current user profile
  fetch("http://localhost:8000/api/profile/", {
    headers: { Authorization: "Bearer " + access }
  })
    .then(res => res.json())
    .then(profile => setCurrentUser(profile.username));
}, []);


  const handlePost = () => {
    if (!newPost.trim()) return;

    fetch("http://localhost:8000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({ content: newPost })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            setPosts([{
                id: data.id,
                user: data.user,
                content: data.content,
                created_at: data.created_at
        }, ...posts]);
        setNewPost("");
    });

  };

  return (
    <div>
      <h2>📰 Feed</h2>

      <textarea
        placeholder="What's on your mind?"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      /><br />
      <button onClick={handlePost}>Post</button>

      <hr />

{posts.map((post, index) => (
  <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
    <strong>{post.user}</strong><br />
    <p>{post.content}</p>
    <small>{new Date(post.created_at).toLocaleString()}</small>

    {/* Sadece kendi postun için delete göster */}
  {post.user === currentUser && (
  <div>
    <button onClick={() => handleDelete(post.id)}>🗑 Delete</button>
    <button onClick={() => handleEdit(post)}>✏️ Edit</button>
  </div>
)}

{/* Eğer düzenleniyorsa textarea göster */}
{editingPostId === post.id && (
  <div>
    <textarea
      value={editedContent}
      onChange={(e) => setEditedContent(e.target.value)}
    />
    <br />
    <button onClick={handleSaveEdit}>💾 Save</button>
    <button onClick={() => setEditingPostId(null)}>❌ Cancel</button>
  </div>
)}


    {/* 💬 Yorumlar */}
    {post.id && <CommentSection postId={post.id} />}
  </div>
))}

    </div>
  );
}

export default Feed;
