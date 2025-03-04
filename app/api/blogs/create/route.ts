import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validation";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const { title, subtitle, coverImg, content, category } = body;
    const isValid = blogSchema.safeParse({
      title,
      subTitle: subtitle,
      coverImg,
      content,
      category,
    });

    if (!isValid.success) {
      return NextResponse.json({ msg: "Invalid Data" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        subtitle,
        coverImg,
        content,
        category,
        authorId: existingUser.id,
      },
      include: {
        Comments: true,
      },
    });
    return NextResponse.json(
      { msg: "Published successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { err: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
