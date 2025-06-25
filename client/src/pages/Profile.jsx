import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../utils/axios.js";
import { User as UserIcon } from "lucide-react";
import Post from "../components/Post.jsx";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        let userId = id;
        if (!userId) {
          const res = await api.get("/auth/check");
          userId = res.data.id;
          setUser(res.data);
        } else {
          const res = await api.get(`/users/${userId}`);
          setUser(res.data);
        }

        const statsRes = await api.get(`/auth/stats/${userId}`);
        setStats(statsRes.data);

        const postsRes = await api.get(`/posts/user/${userId}`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    fetchUserData();
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-white">
      <div className="flex items-center gap-6 mb-8">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <UserIcon className="w-20 h-20 text-gray-500" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex gap-4 text-gray-400 mt-1">
            <span>{stats.posts} posts</span>
            <span>{stats.followers} followers</span>
            <span>{stats.following} following</span>
          </div>
        </div>
      </div>
      <div className="border-b w-full mt-5 mb-5 rounded-full border-gray-700"></div>

      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              imageUrl={post.imageUrl}
              caption={post.content}
              likes={post.likes || []}
              currentUserId={user.id}
              username={user.name}
              avatar={
                user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <UserIcon />
                )
              }
            />
          ))
        )}
      </div>
    </main>
  );
}

export default Profile;
