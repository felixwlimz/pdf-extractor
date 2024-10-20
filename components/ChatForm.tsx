'use client'
import { Plus, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";

type ChatFormProps = {
  chat: string;
  setChat: Dispatch<SetStateAction<string>>;
  onClick : () => void 
};

const ChatForm = ({ chat, setChat, onClick} : ChatFormProps) => {

  return (
    <div className="w-full p-2 flex gap-5 items-center">
      <Button
        type="button"
        className="rounded-[50px] bg-green-400 hover:bg-green-600 p-2"
      >
        <Plus />
      </Button>
      <Input
        type="text"
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />
      <Button
        onClick={onClick}
        type="button"
        className="rounded-[50px] bg-green-400 hover:bg-green-600 p-2"
      >
        <Send/>
      </Button>
    </div>
  );
};

export default ChatForm;
