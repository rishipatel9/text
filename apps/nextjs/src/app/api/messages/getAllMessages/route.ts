import { NextApiRequest } from 'next';
import prisma from '@/lib/prisma'; 
import { NEXT_AUTH } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export default async function allMessages(req: NextApiRequest) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' });
  }

  const chatId = parseInt(req.query.chatId as string);

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: chatId },
      include: {
        sender: { select: { name: true, image: true, email: true } },
        chat: true,
      },
    });

    NextResponse.json(messages);
  } catch (error) {
    NextResponse.json({ message: error });
  }
}
