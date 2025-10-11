import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useSocketContext } from "@/context/socket";

const RedDot = () => (
  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
);

export const NotificationSidebar = () => {
  const [open, setOpen] = useState(false);
  const { messages, markAllAsRead, unreadCount } = useSocketContext();

  useEffect(() => {
    if (open) markAllAsRead();
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && <RedDot />}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-2 overflow-y-auto max-h-[80vh]">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications.</p>
            ) : (
              messages.map((msg) => (
                <Card key={msg._id} className="w-60 p-2">
                  <p className="text-sm text-gray-500">{msg.sender}</p>
                  <p>{msg.text}</p>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
