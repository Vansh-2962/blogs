"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { UploadButton } from "@/utils/uploadthing";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categories from "@/lib/categories";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { BlogType } from "@/app/(main)/blog/[blogId]/page";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  // "bullet",
  "link",
  "image",
];

interface CreateBlogFormProps {
  title: string;
  buttonText: string;
  blog?: BlogType;
}

const CreateBlogForm = ({ title, buttonText, blog }: CreateBlogFormProps) => {
  const [coverImgUrl, setCoverImgUrl] = useState(blog?.coverImg || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [content, setContent] = useState(blog?.content || "");
  const [blogTitle, setBlogTitle] = useState(blog?.title || "");
  const [subTitle, setSubTitle] = useState(blog?.subtitle || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      title: blogTitle,
      subtitle: subTitle,
      coverImg: coverImgUrl,
      content,
      category,
    };
    try {
      setLoading(true);
      if (blog) {
        const response = await axios.put(
          `/api/blogs/update/${blog.id}`,
          blogData
        );
        toast(response.data.msg);

        router.push(`/`);
      } else {
        const response = await axios.post("/api/blogs/create", blogData);
        toast(response.data.msg);

        router.push(`/blog/${response.data.blog.id}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setCoverImgUrl("");
      setCategory("");
      setContent("");
      setBlogTitle("");
      setSubTitle("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1
        className="md:text-3xl font-bold 
      bg-gradient-to-r from-orange-500 via-red-800 to-pink-500 text-transparent bg-clip-text
      "
      >
        {title}
      </h1>
      <div className="mt-10 flex flex-col">
        <input
          type="text"
          placeholder="Title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className="md:text-4xl text-3xl font-bold bg-transparent border-none outline-none my-4"
        />
        <input
          type="text"
          placeholder="subtitle"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          className="md:text-2xl font-bold bg-transparent border-none outline-none my-4"
        />
      </div>
      <div className="my-5 flex items-center justify-between">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-col items-end gap-2">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setCoverImgUrl(res[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              button:
                "ut-ready:bg-orange-600 ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-orange-400",
              container:
                "w-max flex-row rounded-md border-cyan-300 bg-slate-800",
              allowedContent:
                "flex h-8 flex-col items-center justify-center px-2 text-white",
            }}
          />
          <small className="hidden md:block">{coverImgUrl}</small>
        </div>
      </div>
      <small className="md:hidden">{coverImgUrl}</small>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />
      <Button className="mt-12 px-10" disabled={loading}>
        {loading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" /> Updating...
          </>
        ) : (
          <>{buttonText}</>
        )}
      </Button>
    </form>
  );
};

export default CreateBlogForm;
