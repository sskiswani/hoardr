import type { Prisma } from '@prisma/client';
import type { Fields, File, Files } from 'formidable';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import prisma from '~/lib/prisma';
import { uploadDir } from '~/util/env';
import logger from '~/util/logger';

interface ParsedFile {
  fields: Fields;
  files: Files;
}

function parseFile(req: NextApiRequest) {
  console.log('uploadDir', uploadDir);
  return new Promise<ParsedFile>((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
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
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: file.originalFilename!,
    id: file.newFilename.split('.').shift(),
    path: file.filepath
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { files } = await parseFile(req);

    const uploadData = Object.entries(files).flatMap<Prisma.UploadCreateInput>(([key, file]) => {
      logger.info('got key', { key });
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
