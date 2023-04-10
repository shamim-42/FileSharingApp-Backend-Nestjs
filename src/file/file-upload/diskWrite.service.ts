import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DiskWriteService {
  async saveFile(filename: string, file: Buffer): Promise<string> {
    let custom_filename = `${uuid()}-${filename}`;
    const uploadDir = path.join(__dirname, '..', process.env.FOLDER);
    const filePath = path.join(uploadDir, custom_filename);
    // create uploads directory if it doesn't exist
    await fs.promises.mkdir(uploadDir, { recursive: true });

    await fs.promises.writeFile(filePath, file);
    return filePath;
  }

  async deleteFileFromDisk(filePath) {
    try {
      await unlink(filePath);
    } catch (err) {
      return {
        message: 'something_wrong',
      };
    }
  }
}
