"use client";
import { getBlogById } from "@/actions/getBlogById";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Blog, Comment, Like } from "@prisma/client";
import Image from "next/image";
import {
  EllipsisVertical,
  Heart,
  LoaderCircle,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Author from "@/components/Author";
import axios from "axios";
import CommentPage from "@/components/Comment";
import Link from "next/link";

export type CommentType = Comment & {
  author: {
    email: string;
    name: string;
    profilePic: string | null;
  };
};

export type BlogType = Blog & {
  author: {
    profilePic: string | null;
    name: string;
    email: string;
    password?: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  Comments: CommentType[];
  Likes: Like[];
};

const SingleBlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<BlogType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showComment, setShowComment] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commenting, setCommenting] = useState<boolean>(false);
  const [commented, setCommented] = useState<boolean>(false);
  const [liking, setLiking] = useState<boolean>(false);
  const [liked, setLiked] = useState();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();

  const getBlog = useCallback(async () => {
    setLoading(true);
    const data = await getBlogById(blogId as string);
    setBlog(data?.blog);
    if (!data?.success) {
      toast(data?.msg);
    }
    setLoading(false);
  }, [blogId]);
  useEffect(() => {
    getBlog();
  }, [blogId, commented, liked, isDeleted, isEdited, getBlog]);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setCommented(false);
      setCommenting(true);
      const response = await axios.post(`/api/blogs/comment/${blogId}`, {
        comment,
      });
      setComment("");
      setCommented(true);
      toast(response.data.msg);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
     
    } finally {
      setCommenting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      setLiking(true);
      const response = await axios.post(`/api/blogs/like/${id}`);
      setLiked(response.data);
      toast(response.data.msg);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
    
    } finally {
      setLiking(false);
    }
  };

  const isLiked = blog?.Likes.some((like) => like.authorId === blog?.authorId);

  const deleteBlog = async (id: string) => {
    try {
      await axios.delete(`/api/blogs/delete/${id}`);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
      
    }
  };

  return (
    <main className="max-w-4xl mx-auto flex flex-col items-center justify-start px-4 mb-10">
      {loading ? (
        <div className="mt-10 w-full flex items-center justify-center gap-2 text-zinc-500">
          <LoaderCircle className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : (
        <>
          <div>
            {blog?.coverImg && (
              <div className="">
                <Image
                  src={blog.coverImg}
                  alt="coverImg"
                  width={800}
                  height={300}
                />
              </div>
            )}
          </div>
          <div className=" w-full md:px-8">
            <section className="mt-5 w-full">
              <div className="flex md:flex-row flex-col md:items-center justify-between w-full ">
                <h1 className="font-bold text-3xl ">{blog?.title}</h1>
                <small className="font-semibold text-zinc-400">
                  {blog?.createdAt.toLocaleDateString()}
                </small>
              </div>
              <p className="text-zinc-500 mt-2">{blog?.subtitle}</p>
            </section>

            <div className="w-full flex items-center justify-between  mt-4">
              <span className=" inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-700 ring-1 dark:text-orange-500 ring-orange-700/10 ring-inset ">
                {blog?.category}
              </span>

              <div>
                <Popover>
                  <PopoverTrigger className="cursor-pointer">
                    <EllipsisVertical
                      className={`w-4 h-4 text-zinc-500 hover:text-zinc-400 cursor-pointer `}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <Button variant={"outline"} className="w-full" size={"sm"}>
                      <Link href={`/blog/edit/${blog?.id as string}`}>
                        Edit blog
                      </Link>
                    </Button>
                    <Button
                      onClick={() => deleteBlog(blog?.id as string)}
                      variant={"destructive"}
                      className="w-full mt-2"
                      size={"sm"}
                    >
                      Delete blog
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* author details */}
            <Author
              name={blog?.author?.name as string}
              profilePic={blog?.author?.profilePic as string}
              email={blog?.author?.email as string}
            />

            <section className="mt-10 ">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
              />
            </section>
          </div>
          <Separator className="mt-10" />

          {/* Like and Comment section */}
          <section className=" h-40 w-full flex items-center justify-center gap-2">
            <Button
              disabled={liking}
              onClick={() => handleLike(blog?.id as string)}
              className="flex items-center gap-2 border px-5 py-2 rounded-full ring-1 ring-rose-500 bg-transparent text-rose-500 hover:text-white hover:bg-rose-500/80"
            >
              {liking ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <Heart
                    className={`w-6 h-6  ${isLiked && "fill-rose-500"} `}
                  />
                  <span>
                    {blog?.Likes.length !== 0 && blog?.Likes.length}{" "}
                    {blog?.Likes.length === 1 ? "Like" : "Likes"}
                  </span>
                </>
              )}
            </Button>
            <Button
              disabled={commenting}
              className="flex items-center gap-2 border px-5 py-2 rounded-full ring-1 ring-green-500 bg-transparent text-green-500 hover:text-white hover:bg-green-500/80"
              onClick={() => setShowComment(!showComment)}
            >
              <MessageCircle
                className="w-6 h-6  
              "
              />
              {blog?.Comments.length !== 0 && blog?.Comments.length}{" "}
              {blog?.Comments.length === 1 ? "Comment" : "Comments"}
            </Button>
          </section>
          {showComment && (
            <form onSubmit={addComment} className="w-full comment-animation">
              <Author
                name={blog?.author?.name as string}
                profilePic={blog?.author?.profilePic as string}
                email={blog?.author?.email as string}
              />
              <div className="px-10 mt-5 flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="bg-transparent  outline-none border-b-2 w-full"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button size={"sm"} variant={"outline"}>
                  {commenting ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          )}
          {/* Comments page */}
          <div className="p-2 w-full mt-8">
            {blog?.Comments.map((comment, index) => (
              <CommentPage
                key={index}
                id={comment.id}
                content={comment.content}
                createdAt={comment.createdAt}
                author={comment.author}
                setDeleted={setIsDeleted}
                setEdited={setIsEdited}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default SingleBlogPage;
