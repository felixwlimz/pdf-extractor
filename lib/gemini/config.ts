import { GoogleGenerativeAI } from "@google/generative-ai";

const googleAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model 