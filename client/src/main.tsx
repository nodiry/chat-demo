import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import LandingPage from "./App";
import Chat from "./Chat";
import DashBoard from "./dash";
import { SocketProvider } from "./context/socket";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route path="/dash" element={<DashBoard />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<div>not available</div>} />
          </Routes>
        </Router>
        <Toaster />
      </SocketProvider>
    </ThemeProvider>
  </StrictMode>
);
