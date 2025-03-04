import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const { newComment } = await req.json();
    const response = await prisma.comment.update({
      where: { id: id },
      data: { content: newComment },
    });
    if (!response) {
      return NextResponse.json({ msg: "Comment not found!" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "Comment updated successfully!", comment: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Failed to edit comment", error },
      { status: 500 }
    );
  }
}
