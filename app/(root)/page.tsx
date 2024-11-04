'use client'
import HeroPage from "@/components/HeroPage";
import SideChat from "@/components/SideChat";


export default function Home() {

  return (
    <div className="w-full ml-4 mb-10 p-4">
      
      <HeroPage />
      <SideChat />
    </div>
  );
}
