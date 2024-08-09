import { NEXT_AUTH } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(NEXT_AUTH);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const subscribedChats = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
      select: {
        chats: true,
      },
    });
    const chatIds = subscribedChats?.chats.map((chat) => chat.id);
    console.log("chatIds:", chatIds);
    return NextResponse.json(chatIds, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 400 });
  }
};
