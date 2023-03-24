import { readFile } from 'fs/promises';
import mime from 'mime';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import prisma from '~/lib/prisma';
import { getUploadPath } from '~/util/env';

type ApiError = { message: string; status: number };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageId = req.query.id as string;

  try {
    const upload = await prisma.upload.findUniqueOrThrow({
      where: { id: imageId }
    });

    const abspath = getUploadPath(upload.path);
    const result = await readFile(abspath);
    const contentType = mime.getType(abspath) ?? `image/${path.extname(abspath).slice(1)}`;
    return res.setHeader('Content-Type', contentType).status(200).send(result);
  } catch (error: unknown) {
    console.error(error);
    const { message = 'An unknown error occured', status = 500 } = error as ApiError;
    return res.status(status).end(message);
  }
}
