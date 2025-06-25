import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../utils/axios.js";

function GuestWrapper({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/check")
      .then(() => {
        setIsAuth(true);
        navigate("/");
      })
      .catch(() => {
        setIsAuth(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <p className="text-white p-6">Loading...</p>;

  return !isAuth ? children : null;
}

export default GuestWrapper;
