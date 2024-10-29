import React from "react";
import { Button } from "./ui/button";
import {  User } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, FileText } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

const Navbar = ({ user } : { user : User}) => {

  return (
    <nav className="w-full p-4">
      <div className="flex justify-between items-center ml-4 mb-10 mr-4">
        <div className="flex gap-6">
          <Link
            href="/"
            className="flex gap-2 cursor-pointer font-semibold md:text-lg text-xl text-green-600"
          >
            <FileText /> <span>PDFExtractor</span>
          </Link>
          <ul className="flex gap-5 font-semibold text-lg max-[768px]:hidden">
            <li>
              <Link href="/chat-bot" className="hover:text-green-600">
                chat.ai
              </Link>
            </li>
            <li>
              <Link href="/extract-file" className="hover:text-green-600">
                Extract from Files
              </Link>
            </li>
          </ul>
        </div>
        <MobileNavbar user={user} />
        <div className="flex gap-4 items-center max-[768px]:hidden">
          {!user ? (
            <>
              <Link href="/sign-in">
                <Button className="font-semibold text-lg bg-green-400 hover:bg-green-600">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="font-semibold border border-green-400 text-lg hover:bg-green-600 hover:text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Bell />
              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
