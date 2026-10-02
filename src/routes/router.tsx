import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { hasAuthToken } from "../common/auth/authStorage";
import Home from "../pages/Home/Home";
import FlightTravel from "../pages/FlightSearch/FlightTravel";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import FlightInfo from "../components/flight/FlightResults/FlightInfo";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Navigate to={hasAuthToken() ? "/flight-search" : "/login"} replace />
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "flight-search",
            element: <Home />,
          },
          {
            path: "flight-search/travel",
            element: <FlightTravel />,
          },
          {
            path: "flight-search/travel/info",
            element: <FlightInfo />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
