import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
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
      return NextResponse.json(
        { msg: "Invalid Data", error: isValid.error },
        { status: 400 }
      );
    }
    const updatedBlog = await prisma.blog.update({
      where: {
        id,
      },
      data: {
        title,
        subtitle,
        coverImg,
        content,
        category,
      },
    });
    if (!updatedBlog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Blog updated successfully", updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Something went wrong", err: error },
      { status: 500 }
    );
  }
}
