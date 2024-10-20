import { NextResponse } from "next/server";
import model from "./config";

export const createChat = async (prompt : string) => {
  const chat = model.startChat({
    history: [],
  });

  const result = await chat.sendMessage(prompt)
   
  if(!result) throw new Error 
  
  return NextResponse.json({
    message  : result.response.text()
  })
};
