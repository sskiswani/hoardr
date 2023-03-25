import type { Prisma } from '@prisma/client';
import type { Fields, File, Files } from 'formidable';
import formidable from 'formidable';
import { existsSync, mkdirSync } from 'fs';
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { extname, relative } from 'path';
import prisma from '~/lib/prisma';
import { uploadDir } from '~/util/env';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

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

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
