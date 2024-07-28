
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export  async function POST(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);
  const data=await req.json()
  const {userId} = data;
  console.log(userId)
  if (!session || !userId) {
    return NextResponse.json({ message: 'UserId param not sent with request' });
  }
  // const user=await prisma.user.create({
  //   data:{
  //     email:"1",
  //     image:"1",
  //     name:"r",
  //     provider:"google",
  //     providerId:"sa"
  //   }
  // })
  try {
    console.log("inside try catch")
    const chat = await prisma.chat.findFirst({
      where: {
        isGroupChat: false,
        AND: [
          { users: { some: { id: session?.user?.id } } },
          { users: { some: { id: parseInt(userId) } } },
        ],
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        latestMessage: { include: { sender: { select: { name: true, image: true, email: true } } } },
      },
    });

    console.log(chat);
    if (chat) {
      return NextResponse.json(chat);
    } else {
      console.log("chat existed");
      const newChat = await prisma.chat.create({
        data: {
          chatName: 'sender',
          isGroupChat: false,
          users: {
            connect: [{ id: session?.user?.id }, { id: parseInt(userId) }],
          },
        },
        include: {
          users: { select: { id: true, name: true, image: true } },
        },
      });
      console.log("new chat created");
      return NextResponse.json(newChat);
    }
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
