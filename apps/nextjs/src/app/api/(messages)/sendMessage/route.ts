import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { content, chatId } = req.body;

  if (!session || !content || !chatId) {
    return res.status(400).json({ message: 'Invalid data passed into request' });
  }
  try {
    const newMessage = await prisma.message.create({
      data: {
        content: content,
        chat: { connect: { id: parseInt(chatId) } },
        sender: { connect: { id: session?.user?.id } },
      },
      include: {
        sender: { select: { name: true, image: true } },
        chat: true,
      },
    });

    // Update the latestMessage field in the chat
    await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: { latestMessage: { connect: { id: newMessage.id } } },
    });

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
