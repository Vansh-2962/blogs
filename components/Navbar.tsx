import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/nextjs";
import { SquarePen } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="p-5 md:p-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-2xl">
        Blog
      </Link>

      <div className="flex items-center md:gap-3 gap-1">
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
            <Button variant={"link"}>
              <Link href={"/blog/create"} className="flex items-center gap-2">
                <SquarePen className="w-4 h-4" /> Create
              </Link>
            </Button>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
