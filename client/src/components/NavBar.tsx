import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

import { Button } from "./ui/button";
import { LayoutDashboard, LogOutIcon, MessageCircleCode } from "lucide-react";
import { NotificationSidebar } from "./noties";

const NavBar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("http://localhost:3003/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-14 px-12 flex items-center justify-between backdrop-blur-md z-40 border-b">
        <div className="flex items-center space-x-4">
          {/* Dashboard Button */}
          <Button variant="outline" onClick={() => navigate("/dash")}>
            <LayoutDashboard />
          </Button>
          <Button variant="outline" onClick={() => navigate("/chat")}>
          <MessageCircleCode />
          </Button>
          <NotificationSidebar/>
        </div>
        <div className="flex flex-row space-x-8">
          <ModeToggle />
          <Button
          className="ml-4"
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOutIcon />
          </Button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
