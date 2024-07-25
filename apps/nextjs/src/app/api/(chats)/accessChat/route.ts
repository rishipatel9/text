import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function accessChat(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const userId = req.body.userId;

  if (!session || !userId) {
    return res.status(400).json({ message: 'UserId param not sent with request' });
  }
  try {
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
    if (chat) {
      return res.status(200).json(chat);
    } else {
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

      return res.status(200).json(newChat);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
