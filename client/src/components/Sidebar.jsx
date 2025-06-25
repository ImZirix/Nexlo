import {
  HomeIcon,
  Search,
  Bell,
  MessageCircle,
  PlusCircle,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router";
import { useEffect } from "react";
import api from "../utils/axios.js";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/check")
      .then((res) => setUser(res.data))
      .catch(() => {
        navigate("/login");
      });
  }, []);
  return (
    <aside className="w-64 h-screen flex flex-col bg-gray-900 border-r border-gray-700">
      <nav className="flex flex-col ">
        <h1 className="font-bold text-3xl px-6 py-4 italic">Nexlo</h1>
        {[
          { icon: <HomeIcon />, label: "Home", href: "/" },
          { icon: <Search />, label: "Search", href: "/search" },
          { icon: <Bell />, label: "Notifications", href: "#" },
          { icon: <MessageCircle />, label: "Messages", href: "/messages" },
          { icon: <PlusCircle />, label: "Create", href: "/create" },
        ].map(({ icon, label, href }) => (
          <Link
            key={label}
            to={href}
            className={`flex items-center gap-3 px-4 py-4 rounded hover:bg-gray-800 transition-all duration-300 ${
              location.pathname === href
                ? "bg-gray-800 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-4 py-4 flex items-center gap-3 border-t border-gray-700">
        <User size={30} />
        <Link to="/profile">{user?.name || "Guest"}</Link>

        <button onClick={handleLogout} className="ml-auto hover:cursor-pointer">
          <LogOut color="red" size={30} />
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
