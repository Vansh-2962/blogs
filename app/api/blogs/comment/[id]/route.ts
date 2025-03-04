import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

    const { comment } = await req.json();
    const { id } = await context.params; 

    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        authorId: existingUser.id,
        blogId: id,
      },
    });

    if (!newComment) {
      return NextResponse.json(
        { msg: "Cannot add a comment" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { msg: "Commented Successfully", newComment },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Something went wrong!", err: error },
      { status: 500 }
    );
  }
}
