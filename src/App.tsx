import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { hasAuthToken } from "./common/auth/authStorage";

function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-center text-white">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
          Flight Booking
        </p>
        <h1 className="mt-3 text-3xl font-bold">You’re signed in</h1>
        <p className="mt-3 text-slate-300">
          Your account is ready for upcoming booking features. 
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={hasAuthToken() ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={<Navigate to={hasAuthToken() ? "/home" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
