"use client";
import BlogCard from "@/components/BlogPostCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BlogType } from "./[blogId]/page";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const BLogPage = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogs = await axios.get("/api/blogs");
      setBlogs(blogs.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 w-full flex items-center justify-center gap-2 text-zinc-500">
        <LoaderCircle className="w-5 h-5 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <>
      {/* ALL BLOG POSTS SECTION */}
      <section className="p-3 md:p-0 border-b mt-10">
        <h2 className="font-semibold md:text-2xl text-xl mb-5 pl-3 md:pl-0">
          All blog posts
        </h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mb-8">
          {blogs?.length > 0 &&
            blogs.map((blog) => (
              <BlogCard
                key={blog?.id}
                id={blog?.id}
                title={blog?.title}
                index={5}
                subTitle={blog?.subtitle}
                image={
                  blog?.coverImg ||
                  "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                categories={blog.category}
                author={blog.author.name}
                createdAt={blog?.createdAt.toString()}
              />
            ))}
        </div>
      </section>
    </>
  );
};

export default BLogPage;
