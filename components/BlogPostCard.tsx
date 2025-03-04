import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  id: string;
  title: string;
  subTitle: string | null;
  image: string;
  createdAt: string;
  author: string;
  categories: string;
  index: number;
}

const BlogCard = ({
  id,
  title,
  index,
  subTitle,
  image,
  createdAt,
  author,
  categories,
}: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${id}`}
      className={`${
        index === 0
          ? "md:col-span-2 flex md:flex-row flex-col items-center justify-center gap-4"
          : ""
      } && ${
        index === 3
          ? "md:col-span-2 flex md:flex-row flex-col items-center justify-center gap-4"
          : ""
      } `}
    >
      <div className="">
        <Image src={image} alt="image" width={700} height={100} />
      </div>
      <div>
        <h2 className="text-sm mt-5 font-semibold  dark:text-violet-400 text-violet-500">
          {author} &#x2022; {createdAt}
        </h2>
        <p className="mt-3 font-bold text-2xl">{title}</p>
        <p className="mt-2 text-sm dark:text-zinc-400 text-zinc-500">
          {subTitle}
        </p>

        <span className=" mt-5 mr-2 inline-flex items-center rounded-full bg-rose-50 text-rose-600 ring-rose-500   dark:bg-rose-500/20 px-2 py-1 text-xs font-medium dark:text-rose-500 ring-1 dark:ring-rose-600/50 ring-inset">
          {categories}
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
