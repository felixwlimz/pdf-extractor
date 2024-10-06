import React from "react";
import { Button } from "./ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, FileText } from "lucide-react";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="w-full">
      <div className="flex justify-between items-center p-4 ml-4 mb-10 mr-4">
        <h3 className="flex gap-2 font-semibold text-xl  text-orange-700">
          <FileText /> <span>PDFExtractor</span>
        </h3>
        <div className="flex gap-4 items-center">
          <Bell />
          {!user ? (
            <Link href="/sign-in">
              <Button className="font-semibold text-xl bg-orange-400 hover:bg-orange-500">
                Log In
              </Button>
            </Link>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
