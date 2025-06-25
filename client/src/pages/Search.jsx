import { useState, useEffect } from "react";
import api from "../utils/axios.js";
import { Link } from "react-router"; // import Link
import { User } from "lucide-react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "" && user) {
        api
          .get(`/search/users?query=${query}&excludeId=${user.id}`)
          .then((res) => setResults(res.data))
          .catch((err) => console.error(err));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, user]);

  useEffect(() => {
    api
      .get("/auth/check")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <main className="flex flex-col items-center px-4 py-8 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="w-full max-w-md px-4 py-2 mb-6 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {results.length === 0 && query ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="w-full max-w-md space-y-4">
          {results.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-4 w-full"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
                <span className="font-medium">{user.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Search;
