import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Homepage from "../pages/Homepage.jsx";
import AuthWrapper from "../components/AuthWrapper.jsx";
import GuestWrapper from "../components/GuestWrapper.jsx";
import Create from "../pages/Create.jsx";
import Messages from "../pages/Messages.jsx";
import Search from "../pages/Search.jsx";
import Profile from "../pages/Profile.jsx";

let router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthWrapper>
        <App />
      </AuthWrapper>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/create",
        element: (
          <AuthWrapper>
            <Create />
          </AuthWrapper>
        ),
      },
      {
        path: "/messages",
        element: (
          <AuthWrapper>
            <Messages />
          </AuthWrapper>
        ),
      },
      {
        path: "/search",
        element: (
          <AuthWrapper>
            <Search />
          </AuthWrapper>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthWrapper>
            <Profile />
          </AuthWrapper>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <AuthWrapper>
            <Profile />
          </AuthWrapper>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestWrapper>
        <Login />
      </GuestWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestWrapper>
        <Signup />
      </GuestWrapper>
    ),
  },
]);

export default router;
