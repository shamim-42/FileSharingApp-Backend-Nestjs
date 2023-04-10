import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { FileUploadService } from './file-upload/file-upload.service';
import { File as FileEntity } from './file.entity';
import { HelperService } from './helper/helper.service';
import { createReadStream } from 'fs';
import { promises as fsPromises, constants } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private helperService: HelperService,

    @InjectConnection()
    private connection: Connection,

    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async deleteFile(privatekey: string) {
    const fileinfo = await this.fileRepository.findOne({
      where: { private_key: privatekey },
    });
    if (fileinfo) {
      const url = fileinfo.url;
      const fileId = fileinfo.id;
      const storageLocation = fileinfo.storage_location;

      // First we should delete the row from the database then remove the file from disk (or cloud)
      const result = await this.fileRepository.delete(fileId);

      if (result.affected == 1) {
        this.fileUploadService.deleteFileFrom({
          fileUrl: url,
          storageLocation: storageLocation,
        });
        return {
          status_code: 200,
          message: 'File has successfully been deleted!',
        };
      }
    } else {
      return {
        status_code: 200,
        message: 'No record found with this key!',
      };
    }
  }

  async fetch_user_info({ user_id }) {
    const user_info = await this.userService.findUserbyId(user_id);
    return user_info;
  }

  async getFile(publickey, user_id, user_ip) {
    ////////// Rate Limit business logic ///////////
    const rate_limiter_flag = await this.helperService.rateLimiter({
      user_id: null,
      user_ip: user_ip,
    });
    console.log('rate limiter flag');
    console.log(rate_limiter_flag);
    if (rate_limiter_flag) {
      // As the user already downloaded the number of files compying our rate limiting number, we should not allow him to proceed forward
      const errorMessage = `<h1 style="color:green">You have reached your limit! Please try ${process.env.DOWNLOAD_LIMIT_DURATION} later of your last download time</h1>`;
      const stream = new Readable();
      stream.push(errorMessage);
      stream.push(null);
      return stream;
    }
    ////////// End of Rate Limit business logic ///////////

    try {
      const fileInfo = await this.fileRepository.findOne({
        public_key: publickey,
      });
      const storage_location = fileInfo.storage_location;
      if (storage_location == 'cloud') {
        const s3ObjectUrl = fileInfo.url;
        const s3Object = await this.fileUploadService.getObjectFromS3Url(
          s3ObjectUrl
        );
        const stream = Readable.from(s3Object.Body);
        return stream;
      } else if (storage_location == 'onserver') {
        const diskFilePath = fileInfo.url;

        // We need to check whether really the file exists in the specified directory or not.
        try {
          await fsPromises.access(diskFilePath, constants.F_OK);
        } catch (error) {
          const errorMessage = '<h1>File not found!</h1>';
          // throw new Error(errorMessage);
          const stream = new Readable();
          stream.push(errorMessage);
          stream.push(null);
          return stream;
        }

        //Before returning sream of expected file we shoulc add a entry of user access information
        try {
          await this.helperService.addEntryInFileAccessTable({
            user_ip: user_ip,
          });
        } catch {
          const errorMessage = 'error to create access entry';
          const stream = new Readable();
          stream.push(errorMessage);
          stream.push(null);
          return stream;
        }

        // Returning stream of Disk stored file
        const stream = createReadStream(diskFilePath);
        return stream;
      }
    } catch {
      const errorMessage =
        '<h1 style="color:red">File not exist or deleted by the owner!</h1>';
      const stream = new Readable();
      stream.push(errorMessage);
      stream.push(null);
      return stream;
    }
  }

  async saveFile(
    uploader_ip: string,
    filename: string,
    storage_location: string,
    file: Buffer,
  ) {
    let uploaded_file_path = '';
    if (storage_location == 'onserver') {
      uploaded_file_path = await this.fileUploadService.storeFileInDisk(
        filename,
        file,
      );
    } else if (storage_location == 'cloud') {
      const uploaded_file = await this.fileUploadService.uploadFileToS3(
        filename,
        file,
      );
      uploaded_file_path = uploaded_file.Location;
    } else {
      throw new BadRequestException('Please provide correct storage location');
    }

    const keyPair = this.helperService.generateSimpleKeyPair();

    const fileObj = new FileEntity();
    fileObj.uploader_ip = uploader_ip;
    fileObj.filename = filename;
    fileObj.storage_location = storage_location;
    fileObj.url = uploaded_file_path;
    fileObj.public_key = keyPair.publicKey;
    fileObj.private_key = keyPair.privateKey;
    const result = await this.fileRepository.save(fileObj);
    return {
      publickey: result.public_key,
      privatekey: result.private_key,
    };
  }

  async saveFileRSA(
    uploader_ip: string,
    filename: string,
    storage_location: string,
    file: Buffer,
  ) {
    let uploaded_file_path = '';
    if (storage_location == 'onserver') {
      uploaded_file_path = await this.fileUploadService.storeFileInDisk(
        filename,
        file,
      );
    } else if (storage_location == 'cloud') {
      const uploaded_file = await this.fileUploadService.uploadFileToS3(
        filename,
        file,
      );
      uploaded_file_path = uploaded_file.Location;
    } else {
      throw new BadRequestException('Please provide correct storage location');
    }

    const keyPair = this.helperService.generateRSAKeyPair();

    const fileObj = new FileEntity();
    fileObj.uploader_ip = uploader_ip;
    fileObj.filename = filename;
    fileObj.storage_location = storage_location;
    fileObj.url = uploaded_file_path;
    fileObj.public_key = keyPair.publicKey;
    fileObj.private_key = keyPair.privateKey;
    const result = await this.fileRepository.save(fileObj);
    return {
      publickey: result.public_key,
      privatekey: result.private_key,
    };
  }
}
