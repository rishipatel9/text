import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; 

import { getSession } from 'next-auth/react';

export default async function allMessages(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
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

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
}
