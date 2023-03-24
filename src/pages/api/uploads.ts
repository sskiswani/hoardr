import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const result = await prisma.upload.deleteMany();
    res.status(200).json(result);
  } else {
    const uploads = await prisma.upload.findMany();
    res.status(200).json(uploads);
  }
}
