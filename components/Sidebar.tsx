"use client"
import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { usePathname } from "next/navigation"; // Import from next/navigation

const Sidebar = () => {
  const pathname = usePathname();

  // Function to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="max-md:hidden fixed top-0 left-0 h-screen w-64 bg-green-600 text-white flex flex-col p-6">
      <div className="flex items-center gap-2 mb-10">
        <FileText />
        <Link href="/" className="font-semibold text-xl text-white">
          PDFExtractor
        </Link>
      </div>

      <nav className="flex-grow">
        <ul className="flex flex-col gap-6 font-semibold text-lg">
          <li>
            <Link
              href="/"
              className={`px-3 py-2 rounded ${
                isActive("/") ? "bg-green-800" : "hover:bg-green-900"
              }`}
            >
              Extract From Drive
            </Link>
          </li>
          <li>
            <Link
              href="/chat-bot"
              className={`px-3 py-2 rounded ${
                isActive("/chat-bot") ? "bg-green-800" : "hover:bg-green-900"
              }`}
            >
              Chatbot
            </Link>
          </li>
          <li>
            <Link
              href="/extract-file"
              className={`px-3 py-2 rounded ${
                isActive("/extract-file") ?
                  "bg-green-800" : "hover:bg-green-900"
              }`}
            >
              Upload New Files
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className={`px-3 py-2 rounded ${
                isActive("/history") ?
                  "bg-green-800" : "hover:bg-green-900"
              }`}
            >
              History
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;