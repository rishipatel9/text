import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const session = await getServerSession(NEXT_AUTH);
  const data = await req.json();
  const { content, chatId } = data;

  if (!session || !content || !chatId) {
    return NextResponse.json(
      { message: "Invalid data passed into request" },
      { status: 400 },
    );
  }

  try {
    const chatIdAsNumber = parseInt(chatId, 10);
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatIdAsNumber,
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content,
        chat: { connect: { id: chatIdAsNumber } },
        sender: { connect: { id: user.id } },
      },
    });

    await prisma.chat.update({
      where: { id: chatIdAsNumber },
      data: { latestMessage: { connect: { id: newMessage.id } } },
    });

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error },
      { status: 500 },
    );
  }
}
