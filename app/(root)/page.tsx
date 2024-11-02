'use client'
import HeroPage from "@/components/HeroPage";
import SideChat from "@/components/SideChat";
import { cn } from "@/lib/utils";
import { useState } from "react";


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("w-full ml-4 mb-10 p-4", isOpen && "flex gap-5")}>
      <HeroPage />
      <SideChat isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
