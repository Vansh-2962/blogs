import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const response = await prisma.blog.delete({
      where: {
        id,
      },
    });
    if (!response) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json(
      { msg: "Something went wrong", err: error },
      { status: 500 }
    );
  }
}
