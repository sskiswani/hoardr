import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const count = await prisma.upload.count();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ error });
  }
}
