import type { Upload } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';
import { clearUploads } from '~/util/env';

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { cursor, max, filter } = req.query as Record<'cursor' | 'filter' | 'max', string>;

  if (filter) {
    const query = `%${filter}%`;
    const uploads = await prisma.$queryRaw<Upload[]>(Prisma.sql`SELECT * FROM "Upload" WHERE "name" LIKE ${query};`);

    // TODO: clean
    // const uploads = await prisma.upload.findMany({
    //   where: { id: { in: ids.map(row => row.id) } }
    // });

    res.status(200).json(uploads);
    return;
  }

  // return all
  if (!max && !cursor) {
    const uploads = await prisma.upload.findMany();
    res.status(200).json(uploads);
    return;
  }

  const maxResults = Number.parseInt(max);
  const uploads = await prisma.upload.findMany({
    take: maxResults,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { uploaded: 'desc' }
  });
  res.status(200).json(uploads);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      await GET(req, res);
    } else if (req.method === 'DELETE') {
      const deleteIds = Array.isArray(req.body) ? (req.body as string[]) : undefined;
      const result = await prisma.upload.deleteMany(deleteIds ? { where: { id: { in: req.body } } } : undefined);
      const files = await clearUploads(deleteIds);
      console.assert(result.count === files.length);
      res.status(200).json(files);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
