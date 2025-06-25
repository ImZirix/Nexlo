import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar.jsx";
import Homepage from "./pages/Homepage.jsx";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
