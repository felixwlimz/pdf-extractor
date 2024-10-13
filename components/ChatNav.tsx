import { UserButton } from '@clerk/nextjs';
import React from 'react'

const ChatNav = () => {
  return (
    <nav className="p-4 w-full border-b-2 border-slate-300">
      <div className="flex justify-between ml-5 mt-2 mr-5">
         <h1 className='font-bold text-orange-500 text-2xl'>laufey.ai</h1>
         <UserButton/>
      </div>
    </nav>
  );
}

export default ChatNav