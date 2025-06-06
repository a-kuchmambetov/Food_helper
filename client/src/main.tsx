import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error("Local Storage is not available:", e);
    return false;
  }
}
function AllertBlock() {
  return (
    <div>
      <h1 className="text-red-500 text-center mt-20">
        Local Storage is not available in your browser.
      </h1>
      <p className="text-red-500 text-center mt-4">
        Please enable cookies for this site to function properly.
      </p>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {isLocalStorageAvailable() === false ? <AllertBlock /> : <App />}
    </BrowserRouter>
  </StrictMode>
);
