import { readFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import prisma from '~/lib/prisma';
import { getUploadPath } from '~/util/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageId = req.query.imageId as string;

  try {
    const upload = await prisma.upload.findUniqueOrThrow({
      where: { id: imageId }
    });

    const abspath = getUploadPath(upload.path);
    const filetype = path.extname(abspath).slice(1);
    const result = await readFile(abspath);
    return res.setHeader('Content-Type', `image/${filetype}`).status(200).send(result);
  } catch (error: any) {
    const { message = 'An unknown error occured', status = 500 } = error;
    console.error({ message, status });
    return res.status(status as number).end(message);
  }
}
