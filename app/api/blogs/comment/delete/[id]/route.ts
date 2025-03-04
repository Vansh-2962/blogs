import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;

    const response = await prisma.comment.delete({
      where: {
        id: id,
      },
    });

    if (!response) {
      return NextResponse.json({ msg: "Comment not found!" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Comment deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Something went wrong!", err: error },
      { status: 500 }
    );
  }
}
