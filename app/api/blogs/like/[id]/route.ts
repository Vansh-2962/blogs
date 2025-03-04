import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteParams) {
  try {
    const user = await currentUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user?.emailAddresses[0].emailAddress,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });
    if (!blog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 400 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        authorId: existingUser.id,
        blogId: id,
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json(
        { msg: "You unliked this blog" },
        { status: 200 }
      );
    }

    const like = await prisma.like.create({
      data: {
        authorId: existingUser.id,
        blogId: id,
      },
    });
    return NextResponse.json(
      { msg: "You liked this blog", like },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Something went wrong", err: error },
      { status: 500 }
    );
  }
}
