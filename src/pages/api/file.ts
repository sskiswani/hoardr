import type { Prisma } from '@prisma/client';
import type { Fields, File, Files } from 'formidable';
import formidable from 'formidable';
import { existsSync, mkdirSync } from 'fs';
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { extname, relative } from 'path';
import prisma from '~/lib/prisma';
import { clearUploads, uploadDir } from '~/util/env';
import logger from '~/util/logger';

interface ParsedFile {
  fields: Fields;
  files: Files;
}

function parseFile(req: NextApiRequest) {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
    logger.info('created', uploadDir);
  }

  return new Promise<ParsedFile>((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      multiples: true,
      uploadDir
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

function createInput(file: File): Prisma.UploadCreateInput {
  const filename = file.originalFilename ?? file.newFilename;
  const ext = extname(filename);

  return {
    name: filename.replaceAll(ext, ''),
    id: file.newFilename.replaceAll(ext, ''),
    mime: file.mimetype,
    path: relative(uploadDir, file.filepath)
  };
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { files } = await parseFile(req);

    const uploadData = Object.values(files).flatMap<Prisma.UploadCreateInput>(file => {
      return Array.isArray(file) ? file.map(createInput) : createInput(file);
    });

    const uploadResult = await Promise.all(
      uploadData.map(data =>
        prisma.upload.create({
          data,
          select: {
            id: true,
            name: true,
            path: true
          }
        })
      )
    );

    res.status(200).json(uploadResult);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  logger.info('hm?', req.query);
  const { cursor, max } = req.query as Record<'cursor' | 'max', string>;

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
    if (req.method === 'POST') {
      await POST(req, res);
    } else if (req.method === 'GET') {
      await GET(req, res);
    } else if (req.method === 'DELETE') {
      const result = await prisma.upload.deleteMany();
      const files = await clearUploads();
      console.assert(result.count === files.length);
      res.status(200).json(files);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
