import prisma from '@/lib/prisma'; 
import { NEXT_AUTH } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' },{ status: 401 });
  }
  const data = await req.json();
  const { chatId } = data;
  if (!chatId) {
    return NextResponse.json({ message: 'Chat ID is required' },{status:405});
  }
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      include: {
        sender: { select: { name: true, image: true, email: true } },
        chat: true,
      },
    });

    return NextResponse.json(messages,{status:200});
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal Server Error' },{status:500});
  }
}
