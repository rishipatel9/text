
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export  async function POST(req: NextRequest){
  if (req.method !== 'POST') {
    return NextResponse.json({ message: req.method });
  }
  const session = await getServerSession(NEXT_AUTH);
  console.log(session?.user?.id);
  
  const data=await req.json()
  console.log(data)
  const { content, chatId } = data;
  
  console.log("content",content);
  console.log("chatID",chatId);
  
  if (!session || !content || !chatId) {
    return NextResponse.json({ message: 'Invalid data passed into request' });
  }
  try {
    console.log("inside try catch");

    const newMessage = await prisma.message.create({
      data: {
        content: content,
        chat: { connect: { id: parseInt(chatId) } },
        sender: { connect: { id: session?.user?.id } }
      },
      include: {
        sender: { select: { name: true, image: true } },
        chat: true
      }
    });
    console.log(newMessage)

    console.log("done1")
    await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: { latestMessage: { connect: { id: newMessage.id } } }
    });
    console.log("done2")

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    console.log("inside error");
    return NextResponse.json({ message: error }, { status: 200 });
  }
}
