import React from "react";
import { Button } from "./ui/button";
import { User } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

const Navbar = ({ user } : { user : User }) => {
  return (
    <nav className="w-full p-4 flex justify-between items-center">
      <MobileNavbar user={user} />
      <Link href="/" className="font-semibold text-xl text-green-500 lg:hidden text-center">
        PDFExtractor
      </Link>
      <div/>
      <div className="flex gap-4 items-center ml-auto max-[768px]:hidden">
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
    </nav>
  );
};

export default Navbar;