import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="py-3 mt-10 flex items-center justify-between gap-8 px-3">
      <span className="text-xs">&#169; 2025 Stories | All Rights Reserved</span>
      <div className="flex items-center gap-2">
        <Link href={"#"}>
          <Twitter className="h-4 w-4 fill-white hover:fill-sky-500 transition-all ease-in-out duration-150" />
        </Link>
        <Link href={"#"}>
          <Github className="h-4 w-4 fill-white hover:fill-black transition-all ease-in-out duration-150" />
        </Link>
      </div>
    </section>
  );
};

export default Footer;
