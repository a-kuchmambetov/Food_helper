import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Dish from "./pages/Dish";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { Settings02 } from "untitledui-js/react";
import Footer from "./component/Footer";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "catalog"
  );
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const commontabStyle =
    "px-3 py-2 rounded-sm font-semibold hover:bg-bg-active transition-colors duration-300";
  // Define styles for active and inactive tabs
  const activeTabStyle = " bg-bg-active text-gray-200";
  const inactiveTabStyle = " text-gray-300";

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-white bg-gradient-to-br from-black to-slate-900">
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
                  (activeTab === "inventory"
                    ? activeTabStyle
                    : inactiveTabStyle)
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
          {/* Right side with avatar and settings button */}
          <div className="flex items-center h-full">
            <div className="w-10 p-2 stroke-black">
              <Settings02 size={20} stroke={"#94969C"} />
            </div>
            <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center ml-2"></div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/dish/:id" element={<Dish />} />

        <Route path="/planner" element={<Profile />} />
        <Route path="/inventory" element={<Auth />} />
        <Route path="/help" element={<Auth />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
