import { useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", {
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white w-full">
      <form
        onSubmit={handleLogin}
        className="flex flex-col p-12 border bg-gray-800 rounded shadow gap-6"
      >
        <h1 className="text-center text-4xl mb-6 font-bold ">Welcome back!</h1>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            autoFocus
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="border border-gray-600 rounded py-2 px-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded py-2 px-2 mb-2 border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <a
            href="#"
            className="hover:text-blue-600 transition-all duration-200"
          >
            Forgot password?
          </a>
        </div>
        <div className="text-center">
          <button className="border px-6 py-2 rounded mb-4 hover:bg-blue-600 transition-all duration-200 hover:border-blue-600 cursor-pointer">
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="hover:text-blue-600 transition-all duration-200"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
export default Login;
