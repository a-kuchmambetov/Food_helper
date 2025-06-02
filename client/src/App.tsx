import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Catalog from "./pages/Catalog";
import Dish from "./pages/Dish";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { Settings02 } from "untitledui-js/react";
import Footer from "./component/Footer";
import { useLocation } from "react-router-dom";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <>{children}</>;
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "catalog"
  );

  useEffect(() => {
    setActiveTab(location.pathname.replace("/", "") || "catalog");
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const commontabStyle =
    "px-3 py-2 rounded-sm font-semibold hover:bg-bg-active transition-colors duration-300";
  const activeTabStyle = " bg-bg-active text-gray-200";
  const inactiveTabStyle = " text-gray-300";

  return (
    <nav className="bg-black text-white h-18 shadow-md px-4">
      <div className="container mx-auto h-full flex justify-between items-center">
        {/* Left side with page buttons */}
        <div className="flex flex-row items-center justify-center h-full">
          <div className="font-[Inter] text-xl font-bold text-white mr-4">
            Food Helper
          </div>
          <div className="h-11 flex flex-row items-center space-x-1">
            <Link
              onClick={() => handleTabClick("catalog")}
              to="/catalog"
              className={
                commontabStyle +
                (activeTab === "catalog" ? activeTabStyle : inactiveTabStyle)
              }
            >
              Catalog
            </Link>
            <Link
              to="/planner"
              onClick={() => handleTabClick("planner")}
              className={
                commontabStyle +
                (activeTab === "planner" ? activeTabStyle : inactiveTabStyle)
              }
            >
              Planner
            </Link>
            <Link
              to="/inventory"
              onClick={() => handleTabClick("inventory")}
              className={
                commontabStyle +
                (activeTab === "inventory" ? activeTabStyle : inactiveTabStyle)
              }
            >
              Inventory
            </Link>
            <Link
              to="/help"
              onClick={() => handleTabClick("help")}
              className={
                commontabStyle +
                (activeTab === "help" ? activeTabStyle : inactiveTabStyle)
              }
            >
              Help
            </Link>
          </div>
        </div>

        {/* Right side with user info and settings */}
        <div className="flex items-center h-full space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300 text-sm">
                Welcome, {user?.username}
              </span>
              <Link
                to="/profile"
                onClick={() => handleTabClick("profile")}
                className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold transition-colors duration-300 ${
                  activeTab === "profile"
                    ? "bg-sky-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                title="Profile"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => handleTabClick("auth")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Sign In
            </Link>
          )}
          <div className="w-10 p-2 stroke-black">
            <Settings02 size={20} stroke={"#94969C"} />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main App Component
function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-white bg-gradient-to-br from-black to-slate-900">
      <Navigation />

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/dish/:id" element={<Dish />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Auth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Auth />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
