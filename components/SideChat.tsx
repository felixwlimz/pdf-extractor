import ChatNav from "@/components/ChatNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import model from "@/lib/gemini/config";
import { cn } from "@/lib/utils";
import { Content } from "@google/generative-ai";
import { MessageCircleMore, Plus, Send, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type SideChatProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const SideChat = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Content[]>([]);
    const [isOpen, setIsOpen] = useState(false);


  const sendMessage = async () => {
    if (!message.trim()) return;

    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]);

    try {
      const chat = model.startChat({
        history: [...history, { role: "user", parts: [{ text: message }] }],
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();

      setHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "model",
          parts: [{ text }],
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setMessage("");
    }
  };

  return (
    <>
      <Button
        className={cn(
          "absolute bg-green-500 hover:bg-green-600 rounded-[50%] bottom-0 h-[60px] w-[60px]",
          isOpen ? "bottom-0 right-0 mt-10 mr-10" : "right-10"
        )}
      >
        {!isOpen ? (
          <MessageCircleMore onClick={() => setIsOpen(true)} />
        ) : (
          <X onClick={() => setIsOpen(false)} />
        )}
      </Button>
      {isOpen && (
        <section className="absolute bottom-20 right-0 h-[70%] flex flex-col justify-between p-4 bg-gray-100 border border-gray-300 rounded-lg mr-5">
          <div>
            <h3 className="text-xl font-bold">Chat</h3>
          </div>
          <div
            className="flex flex-col p-4 gap-3 bg-gray-100 flex-1 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {history.map((content, index) => (
              <div
                key={index}
                className={cn("flex", content.role === "user" && "justify-end")}
              >
                <p
                  className={cn(
                    "p-2 m-4 rounded-lg h-fit",
                    content.role === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 w-[120px]"
                  )}
                >
                  {content.role === "user"
                    ? content.parts[0].text
                    : content.parts[0].text}
                </p>
              </div>
            ))}
          </div>
          <div className="relative mb-6 w-[75%] p-2 flex gap-5 items-center">
            <Button
              type="button"
              className="rounded-[50px] bg-green-400 hover:bg-green-600 p-2"
            >
              <Plus />
            </Button>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-green-500 w-fit"
              placeholder="Type 'From the Start' or Something you would like...."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              type="button"
              className="rounded-[50px] bg-green-400 hover:bg-green-600 p-2"
            >
              <Send />
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default SideChat;
