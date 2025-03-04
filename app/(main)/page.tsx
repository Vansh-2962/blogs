"use client";
import BlogCard from "@/components/BlogPostCard";
import { SquarePen } from "lucide-react";
import Link from "next/link";

import { sigmar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { BlogType } from "./blog/[blogId]/page";

export default function Home() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const fetchBlogs = async () => {
    try {
      const blogs = await axios.get("/api/blogs");
      setBlogs(blogs.data);
   
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
     
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <main className="mb-10 ">
        <div className="border-b p-10 flex flex-col justify-center gap-8">
          <h1
            className={`${sigmar.className} uppercase md:text-9xl text-5xl font-bold  text-center tracking-wide bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text`}
          >
            Stories
          </h1>
          <p className="text-center md:text-2xl mt-4">
            Unleash Your Thoughts, Share Your Journey, Inspire the World.
          </p>

          <div className="flex justify-center">
            <SignedOut>
              <Button>
                <SignInButton>Sign In</SignInButton>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button className="rounded-full px-10 bg-gradient-to-r from-[#db2777] via-[#ef4444] to-[#f97316] transition-all duration-300 ease-in-out">
                <Link href={"/blog/create"} className="flex items-center gap-1">
                  <SquarePen className="mr-2 h-4 w-4 " /> Write
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>

        {/* RECENT BLOG POSTS SECTION */}
        <section className="mt-10">
          <h2 className="font-semibold md:text-2xl text-xl mb-5 pl-3 md:pl-0">
            Recent blog posts
          </h2>
          <div className="grid md:grid-cols-2 gap-10 grid-cols-1 p-3 md:p-0">
            {blogs?.map((blog, index) => (
              <BlogCard
                key={blog?.id}
                index={index}
                id={blog.id}
                title={blog?.title}
                subTitle={blog?.subtitle}
                createdAt={new Date(blog?.createdAt).toLocaleDateString()}
                image={blog?.coverImg as string}
                author={blog?.author?.name}
                categories={blog?.category}
              />
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
