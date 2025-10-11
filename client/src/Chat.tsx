import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { useSocketContext } from "./context/socket";

const Chat = () => {
  const [text, setText] = useState("");
  const { messages, sendMessage } = useSocketContext();

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 mt-12 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <Card key={msg._id} className="p-2">
            <p className="text-sm text-gray-500">{msg.sender}</p>
            <p>{msg.text}</p>
            <p>{msg.date}</p>
          </Card>
        ))}
      </div>
      <div className="flex p-4 border-t gap-2">
        <Input
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
