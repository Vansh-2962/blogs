import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sigmar } from "next/font/google";

import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export const sigmar = Sigmar({
  weight: "400",
  subsets: ["latin"],
});

const Navbar = () => {
  return (
    <nav className="p-5 md:p-3 flex items-center justify-between border-b ">
      <Link href="/">
        <span className={`${sigmar.className} font-bold text-2xl`}>
          Stories
        </span>
      </Link>

      <div className="hidden  md:flex items-center md:gap-3 gap-1">
        <Link href={"/blog"} className="md:text-sm text-xs md:mr-4 ">
          Blogs
        </Link>
        <div className="flex items-center md:gap-3 gap-2">
          <SignedOut>
            <SignInButton>
              <Button size={"sm"}>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>
      </div>

      <div className="md:hidden block">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="flex items-start">
              <SheetTitle className={`${sigmar.className} text-2xl mb-5`}>
                Stories
              </SheetTitle>
              <div className="flex flex-col gap-3 mt-3 text-sm">
                <Link href={"/blog"} className="text-left">
                  Blogs
                </Link>
                <span className="flex items-center gap-2">
                  Theme
                  <ModeToggle />
                </span>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
