import ChatNav from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import model from "@/lib/gemini/config";
import { cn } from "@/lib/utils";
import { Content } from "@google/generative-ai";
import { MessageCircleMore, Plus, Send, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import React from "react";

type SideChatProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const SideChat = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Content[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State for loading
  const renderText = (text: string) => {
    const responseArray = text.split("**");

    return responseArray.map((part, i) => {
      const renderedPart = part.split("*").map((subPart, j) => {
        const key = `${i}-${j}`; // Unique key for each <br />
        if (j < part.split("*").length - 1) {
          return (
            <React.Fragment key={key}>
              {subPart}
              <br />
            </React.Fragment>
          );
        }
        return <span key={key}>{subPart}</span>; // Return <span> with unique key for final part
      });

      return (
        <span
          key={`part-${i}`}  // Unique key for the main part
          style={{ fontWeight: i % 2 === 1 ? "bold" : "normal" }}
        >
          {renderedPart}
        </span>
      );
    });
  };
  const sendMessage = async () => {
    if (!message.trim()) return;

    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]);

    // Set loading to true while awaiting the response
    setIsLoading(true);

    try {
      const chat = model.startChat({
        history: [...history, { role: "user", parts: [{ text: message }] }],
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();

      // Add the model's response to the history
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
      setIsLoading(false);  // Set loading to false when done
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
        <section className="absolute bottom-20 right-0 w-[40%] h-[70%] flex flex-col justify-between p-4 bg-gray-200 border border-gray-300 rounded-lg mr-5">
          <div>
            <h3 className="text-xl font-bold">Chat</h3>
          </div>
          <div
            className="flex flex-col p-4 gap-3 bg-gray-200 flex-1 overflow-y-auto"
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
                      : "bg-gray-100"
                  )}
                >
                    {renderText(content.parts[0]?.text ?? "")}
                </p>
              </div>
            ))}

            {/* Display typing... when the bot is generating a response */}
            {isLoading && (
              <div className="flex justify-start p-2 m-4 bg-gray-300 w-[80%] rounded-lg">
                <p>Typing...</p>
              </div>
            )}
          </div>
          <div className="relative mb-6 w-[95%] p-2 flex gap-5 items-center">
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
              className="border border-green-500"
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