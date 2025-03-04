"use server";

import { prisma } from "@/lib/prisma";

export const getBlogById = async (blogId: string) => {
  try {
    if (!blogId) {
      return { success: false, msg: "Blog ID is required" };
    }
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        author: {
          select: {
            profilePic: true,
            name: true,
            email: true,
          },
        },
        Comments: {
          include: {
            author: {
              select: {
                profilePic: true,
                name: true,
                email: true,
              },
            },
          },
        },
        Likes: true,
      },
    });

    if (!blog) {
      return { success: false, msg: "Blog not found" };
    }
    return { success: true, blog };
  } catch (error) {
    return { success: false, msg: "Something went wrong", err: error };
  }
};
