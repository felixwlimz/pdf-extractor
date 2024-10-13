import ChatNav from "@/components/ChatNav";
import ChatSidebar from "@/components/ChatSidebar";

const ChatLayout = ({ children } : { children : React.ReactNode }) => {
  return (
    <div className="w-full">
      <ChatSidebar />
      <main className="md:ml-[350px]">{children}</main>
    </div>
  );
}

export default ChatLayout