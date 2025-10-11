// src/context/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  read: boolean;
  date: string;
};

type SocketContextType = {
  peerStatus: Boolean;
  messages: Message[];
  sendMessage: (text: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerStatus, setPeerStatus] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const sender = localStorage.getItem("name");
    const receiver = localStorage.getItem("peer");

    if (!sender || !receiver) return;

    const newSocket = io("http://localhost:3005", { path: "/ws/chat" });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("init", { sender, receiver });
    });

    newSocket.on("previousMessages", (prevMsgs: Message[]) => {
      setMessages(prevMsgs.map((msg) => ({ ...msg })));
    });
    newSocket.on("online", (status) => {
      setPeerStatus(status);
    });

    newSocket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, { ...msg }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    const sender = localStorage.getItem("name");
    const receiver = localStorage.getItem("peer");

    if (!socket || !sender || !receiver) return;

    const message = {
      _id: Date.now().toString(),
      sender,
      receiver,
      text,
    };

    socket.emit("message", message);
  };

  const markAllAsRead = () => {
    const sender = localStorage.getItem("name");
    const receiver = localStorage.getItem("peer");

    if (!socket || !sender || !receiver) return;

    // Notify backend to mark messages as read
    socket.emit("markAsRead", { sender, receiver });

    // Update local state immediately
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.sender === receiver && msg.receiver === sender && !msg.read
          ? { ...msg, read: true }
          : msg
      )
    );
  };

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <SocketContext.Provider
      value={{ peerStatus, messages, sendMessage, markAllAsRead, unreadCount }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used inside provider");
  return ctx;
};
