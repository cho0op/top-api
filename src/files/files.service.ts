import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';
import { Mfile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: Mfile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadedPath = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadedPath);
    const response: FileElementResponse[] = [];
    for (const file of files) {
      const newFilePath = `${uploadedPath}/${file.originalname}`;
      await writeFile(newFilePath, file.buffer);
      response.push({ url: newFilePath, name: file.originalname });
    }

    return response;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
