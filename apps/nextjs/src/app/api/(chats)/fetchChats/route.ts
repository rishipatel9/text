import prisma from '@/lib/prisma';
import { NEXT_AUTH } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export  async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' },{ status: 500 });
  }
  try {
    console.log("inside fetchChats and try catch");
    const sessionId=await prisma.user.findFirst({
      where:{
        email:session.user.email
      },
      select:{
        id:true
      }
    })
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: { id: sessionId?.id },
        },
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        groupAdmin: { select: { id: true, name: true, image: true } },
        latestMessage: { include: { sender: { select: { name: true, image: true, email: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    console.log(chats);
    

    return NextResponse.json(chats,{ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error },{ status: 500 });
  }
}
