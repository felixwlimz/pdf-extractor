'use client'
import ChatForm from '@/components/ChatForm';
import ChatNav from '@/components/ChatNav';
import { createChat } from '@/lib/gemini';
import { useState } from 'react'

const ChatBotPage = () => {

  const [chat, setChat] = useState('')
  const [messages, setMessages] = useState([])
  const sendMessage = async () => {
     const message = await createChat(chat)
     
     console.log(message)
  }

  return (
    <section className="flex flex-col justify-between p-4">
      <ChatNav />
      <div className='w-fit'>
         
      </div>
      <ChatForm chat={chat} setChat={setChat} onClick={sendMessage}/>
    </section>
  );
}

export default ChatBotPage