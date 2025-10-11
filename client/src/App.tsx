import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldCheck, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./components/ui/input";
import { ChangeEvent, useState } from "react";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [peer, setPeer] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Input Change
  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  // ✅ Handle Input Change
  const changePeer = (e: ChangeEvent<HTMLInputElement>) => {
    setPeer(e.target.value);
  };

  const go = () =>{
    localStorage.setItem('name', name);
    localStorage.setItem('peer', peer);
    navigate('/chat')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <LayoutDashboard className="w-16 h-16 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to <span className="text-blue-500">Chat using socketio and react+vite</span>
          </h1>
          <Input
            type="text"
            placeholder="choose a name "
            value={name}
            onChange={changeName}
          />
          <Input
            type="text"
            placeholder="receiver name "
            value={peer}
            onChange={changePeer}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <Button
            onClick={go}
            size="lg"
            className="text-base px-8 py-6"
          >
            <ShieldCheck className="mr-2 h-5 w-5" /> Let's go!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
