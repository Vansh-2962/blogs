"use client";
import { getBlogById } from "@/actions/getBlogById";
import CreateBlogForm from "@/components/CreateBlogForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogType } from "../../[blogId]/page";
import { LoaderCircle } from "lucide-react";

const BlogEditPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogType>();
  useEffect(() => {
    const getBlog = async () => {
      const response = await getBlogById(id as string);
      setBlog(response?.blog);
    };
    getBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="mt-10 w-full flex items-center justify-center gap-2 text-zinc-500">
        <LoaderCircle className="w-5 h-5 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <CreateBlogForm title={"Edit Blog"} buttonText={"Update"} blog={blog} />
    </main>
  );
};

export default BlogEditPage;
