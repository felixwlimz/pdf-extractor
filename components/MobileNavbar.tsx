import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const MobileNavbar = ({ user }: { user: User }) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent className="w-[500px]">
          <div className="flex flex-col justify-center gap-9 w-full">
            {user ? (
              <div>
                <div className="flex gap-4 items-center">
                  <UserButton />
                  <h3 className="text-lg font-semibold">{user.fullName}</h3>
                </div>
                <p className="text-sm text-gray-500 ml-11">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button className="font-semibold text-lg bg-green-400 hover:bg-green-600-600">
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    className="font-semibold border border-green-400 text-lg hover:bg-green-600-600 hover:text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <ul className="flex flex-col gap-5 font-semibold text-lg">
              <li>
                <Link href="/chat-bot" className="hover:text-green-600-700 ">
                  laufey.ai
                </Link>
              </li>
              <li>
                <Link href="/extract-file" className="hover:text-green-600-700">
                  Extract from File
                </Link>
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
