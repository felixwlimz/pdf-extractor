"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/use-local-storage";
import model from "@/lib/gemini/config";
import { cn } from "@/lib/utils";
import { Content } from "@google/generative-ai";
import { Plus, Send } from "lucide-react";
import { useState, useCallback, useEffect } from "react"; // Added useEffect for client-side checks
import React from "react";

// ChatBotPage Component
const ChatBotPage = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Content[]>([]);
  const [chats, setChats] = useLocalStorage<Content[]>("chats", []);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to check if we are on the client

  // Check if the component is mounted on the client side
  useEffect(() => {
    setIsClient(true); // This will set isClient to true once mounted
  }, []);

  // Initialize chats from localStorage when client-side only
  useEffect(() => {
    if (isClient) {
      setChats((oldChats) => oldChats || []); // Initialize chats if not already
    }
  }, [isClient, setChats]);

  // Function to render styled text with breaks and bold sections
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

  // Function to handle message sending
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;

    // Optimistically update history before sending the message
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]);
    setIsLoading(true); // Set loading to true

    try {
      // Send message to model and get the response
      const chat = model.startChat({
        history: [...history, { role: "user", parts: [{ text: message }] }],
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();

      // Update history with the response from the model
      setHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "model",
          parts: [{ text }],
        },
      ]);

      // Store the chats only when history is empty
      if (history.length === 0) {
        setChats((oldChats) => [...oldChats, ...history]);
      }
    } catch (error) {
      console.error("Error during chat:", error);
    } finally {
      setIsLoading(false); // Set loading to false after completion
      setMessage(""); // Reset message input
    }
  }, [message, history, setChats]);

  // If the component is not mounted on the client, render nothing (for SSR)
  if (!isClient) return null;

  return (
    <div className="flex flex-col justify-between p-4 md:ml-64">
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
                "p-2 rounded-lg w-fit h-fit",
                content.role === "user"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              )}
            >
              {renderText(content.parts[0]?.text ?? "")}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col p-4 gap-3 bg-gray-100 flex-1 overflow-y-auto">
            <p className="p-2 bg-gray-300 rounded-lg w-fit h-fit text-gray-700">
              Typing...
            </p>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 top-[600px] max-md:w-[95%] w-[80%] p-2 right-12 flex gap-5 items-center">
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
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          type="button"
          className="rounded-[50px] bg-green-400 hover:bg-green-600 p-2"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : <Send />}
        </Button>
      </div>
    </div>
  );
};

export default ChatBotPage;