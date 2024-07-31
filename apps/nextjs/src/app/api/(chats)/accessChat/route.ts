import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  const session = await getServerSession(NEXT_AUTH);
  const data = await req.json();
  const { userId } = data;

  if (!session || !userId) {
    return NextResponse.json({ message: 'UserId param not sent with request' },{ status: 404 });
  }
  try {
    const otherUserId = userId
    // console.log(session.user);
    const sessionId=await prisma.user.findFirst({
      where:{
        email:session.user.email
      },
      select:{
        id:true
      }
    })
    // console.log(sessionId);
    const chat = await prisma.chat.findFirst({
      where: {
        isGroupChat: false,
        AND: [
          { users: { some: { id: sessionId?.id } } },
          { users: { some: { id: otherUserId } } },
        ],
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        latestMessage: { include: { sender: { select: { name: true, image: true, email: true } } } },
      },
    });

    if (chat) {
      // console.log("chat Already Exists");
      // console.log(chat);
      return NextResponse.json(chat);
    } else {
      const newChat = await prisma.chat.create({
        data: {
          chatName: 'sender',
          isGroupChat: false,
          users: {
            connect: [{ id: sessionId?.id }, { id: otherUserId }],
          },
        },
        include: {
          users: { select: { id: true, name: true, image: true } },
        },
      });
      return NextResponse.json(newChat);
    }
  } catch (error) {
    console.error('Error creating or accessing chat:', error);
    return NextResponse.json({ message: 'An error occurred', error: error });
  }
}
