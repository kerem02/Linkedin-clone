import { useEffect, useState } from "react";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const access = localStorage.getItem("access");

  useEffect(() => {
    fetch(`http://localhost:8000/api/comments/?post_id=${postId}`, {
      headers: { Authorization: "Bearer " + access }
    })
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  const handleComment = () => {
    if (!newComment.trim()) return;

    fetch("http://localhost:8000/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access
      },
      body: JSON.stringify({
        post_id: postId,
        content: newComment
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setComments(prev => [...prev, {
          user: "You",
          content: newComment,
          created_at: new Date().toISOString()
        }]);
        setNewComment("");
      });
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
      <strong>Comments:</strong>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>
            <strong>{c.user}</strong>: {c.content}<br />
            <small>{new Date(c.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      /><br />
      <button onClick={handleComment}>Comment</button>
    </div>
  );
}

export default CommentSection;
