import { Content } from "@google/generative-ai";
import { Brain, Ellipsis, MessageCircleMore } from "lucide-react";
import React from "react";

const ChatSidebar = ({chats } : { chats : Content[]}) => {
  return (
    <div className="fixed max-[768px]:hidden bg-green-400 space-y-4 text-white h-full w-[350px] flex flex-col gap-10 p-8">
      <div className="flex gap-3">
        <Brain size={32} />
        <h3 className="text-2xl font-bold">chat.ai</h3>
      </div>

      <div className="w-full">
        <div className="flex gap-3 text-xl cursor-pointer hover:bg-green-600 rounded-lg p-2">
          <MessageCircleMore />
          New Chat
        </div>
        <div className="p-2 flex flex-col gap-6">
          {chats.map((chat, i) => (
            <div
              key={i}
              className="flex gap-3 text-xl cursor-pointer hover:bg-green-600 rounded-lg p-2"
            >
              {chat.role === "user" && chat.parts[0].text?.substring(0, 15)}
              <Ellipsis />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
