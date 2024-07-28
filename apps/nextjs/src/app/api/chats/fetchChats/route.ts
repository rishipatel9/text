import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { NEXT_AUTH } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function fetchChats(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: { id: session?.user?.id },
        },
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        groupAdmin: { select: { id: true, name: true, image: true } },
        latestMessage: { include: { sender: { select: { name: true, image: true, email: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
