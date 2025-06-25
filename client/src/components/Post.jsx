import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/axios.js";

function Post({
  username,
  avatar,
  imageUrl,
  caption,
  likes,
  currentUserId,
  id,
}) {
  const [likeCount, setLikeCount] = useState(likes.length);
  const [liked, setLiked] = useState(
    likes.some((like) => like.userId === currentUserId)
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await api.get(`/posts/${id}/comments`);
        console.log("POST /posts/:id/comments reached");

        setComments(res.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    }
    fetchComments();
  }, [id]);

  const handleLikeToggle = async () => {
    try {
      const res = await api.post(`/posts/${id}/like`);
      if (res.data.liked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/posts/${id}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6 w-xl mx-auto">
      <div className="flex gap-3 mb-3">
        {avatar}
        <span className="font-semibold">{username}</span>
      </div>

      {imageUrl && (
        <img
          src={`http://localhost:3000${imageUrl}`}
          alt={caption}
          className="w-full h-96 object-cover rounded mb-3"
        />
      )}

      <p className="text-sm mb-2">
        <strong>{username}</strong> {caption}
      </p>

      <button
        className={`cursor-pointer flex gap-2 items-center transition-all duration-400 hover:scale-110 ${
          liked ? "text-red-500" : "text-white"
        }`}
        onClick={handleLikeToggle}
      >
        <Heart fill={liked ? "currentColor" : "none"} />
        {likeCount}
      </button>

      {/* Comments */}
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Comments</h4>
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="text-sm text-gray-200">
                <strong>{comment.author.name}:</strong> {comment.content}
              </li>
            ))}
          </ul>
        )}

        {/* Comment form */}
        <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-sm rounded hover:bg-blue-700"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;
