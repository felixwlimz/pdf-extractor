import { Brain, MessageCircleMore } from "lucide-react";
import React from "react";

const ChatSidebar = () => {
  return (
    <div className="fixed max-[768px]:hidden bg-orange-400 space-y-4 text-white h-full w-[350px] flex flex-col gap-10 p-8">
      <div className="flex gap-3">
        <Brain size={32} />
        <h3 className="text-2xl font-bold">laufey.ai</h3>
      </div>

      <div className="w-full">
        <div className="flex gap-3 text-xl cursor-pointer hover:bg-orange-500 rounded-lg p-2">
          <MessageCircleMore />
          New Chat
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
