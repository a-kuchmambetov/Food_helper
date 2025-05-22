import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth"; // Import the Auth component

function App() {
  return (
    <>
      <nav className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            Food Helper
          </div>
          <div className="space-x-4">
            <Link
              to="/"
              className="font-bold hover:text-sky-400 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="font-bold hover:text-sky-400 transition-colors duration-300"
            >
              Profile
            </Link>
            <Link
              to="/auth"
              className="font-bold hover:text-sky-400 transition-colors duration-300"
            >
              Auth
            </Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
