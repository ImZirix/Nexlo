import { User } from "lucide-react";
import Post from "../components/Post.jsx";
import { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router";
function Homepage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    api
      .get("/auth/check")
      .then((res) => setUser(res.data))
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return (
    <main className="max-w-3xl p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Home</h1>
      {!user ? (
        <p className="text-center">Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            username={post.author?.name || "Unknown"}
            avatar={
              post.author?.profilePic ? (
                <img
                  src={post.author.profilePic}
                  alt={`${post.author.name}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User />
              )
            }
            imageUrl={post.imageUrl || null}
            caption={post.content}
            likes={post.likes}
            currentUserId={user.id}
          />
        ))
      )}
    </main>
  );
}

export default Homepage;
