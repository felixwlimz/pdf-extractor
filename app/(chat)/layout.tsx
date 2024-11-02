
const ChatLayout = ({ children } : { children : React.ReactNode }) => {

  return (
    <div className="w-full">
      <main>{children}</main>
    </div>
  );
}

export default ChatLayout