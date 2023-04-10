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
      // where: { private_key: "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpLat39SlBhAlaH%2Fq6F%2BSwGH5URBeDLLLFqe2gQlmM4PfcPbGJJ1k%2BAn%2Bek5j3yslzrn37hoIkQ3OSrNrtS67SZMsJWTT%2F8USj20CMF4lNp8YWaOvNE8vY4OhwvFjR77EW0cNu0c7TCcnADYOrbV8PIZNiEi6%2F%2BIhBGqz0v7FO4oAdy66Asl18FB9bQxArGDI8IQDdsKOLn2iMT2vZFvQ5jIvbuwA%2FlO4D4WHPvntknLiReQV0iKixvnVy1ky9cAVpdmyooHG5LxOUe4lyckQMwCAw9iU1eLY1FqQvWuR6GQBawnkl0yRA8v1UuJ3emSvDiGCqaA94bgp2NuFFGPKXAgMBAAECggEAAPUSmFoG%2BilTHDkVYD9a%2BJg%2FQDYXhPBC51Geim4pFGm6c6G%2FMY6z%2FU2JWMp%2BHRnQetzbbSjhJbU0ARFC6TclFmjoFi%2FwzEpzs5aDirAgYIhMY1K%2BAGvd5HZInlCDA8quKNNSUPB2Y1SpNlO6V1C4ZUm0n52ga8sgqUjNTErT0rFKcVOo%2F7O7Q4xkjVQMqtjDuZOvnEswS31EPxT%2FJVYflvARUV0leVbmLjPX%2BQExwWtJj3d6e4DIQeIULYKAAaP9zUSMDn0Sbe75WCZeeqtULdl%2Ff%2Be9kflwEVS1MrFPb5WPKl3zwtIGB%2F33g6fQuwShc99F%2FLFpOLP2worQOaqeUQKBgQC321WmGdBq%2BFCLgyukdDfiJyxawtUy902Sdj%2Fz5Ag%2FccurvzGuDd9WYV8DZce0yI8keGgO31AvkbRJSTjw2lajF24Y1wb%2F0wkdYwCa3E8mMQ5nYJ4PvFDe6FADc%2FsKzznqydDll9NrhizMIVTUwT1tF9ERm0Rp7eJUcpIAFxX0bQKBgQDrj988rZW5HAlKx7yDHC3RimFQ%2BxhdyWuqKvUfEy6zIJm%2FtCrnDJftOcZbvIoPkWrzoolSPUj0dhNK8hbk%2BSYRqxJVJ2GAufZDnFH%2F5sOPrYUc4Zp28N3NcI4TZwPYjEVm3UcLYtivg8KO94YTjYuzHIJbVy30qOVcmBVEgQT4kwKBgAWTBdbCY5pKqw5%2FzJvw1hzqOSMLUzF3ZAezxB6d5E4gIh%2Bz7Uqsqv%2FQdfQBavulNQnTCLyisqiujzvFl49d31CUjkb8hf7NpDIa5VLMqS2sQRaLTF%2BHwx%2FvBTYFly%2FttoDS252Ka%2BOPrt4FiK%2Fmp%2Fkdxr306i8YAkuzKZANIyJFAoGAbY8Xw%2B%2F0MAkjJT2qpswnX0reIjz2w0AYLCgYo6BXWwaxm6DfR2DrFHGHmUkiaUU4GiKhfbd1RAXayUO5dDuRAiyvtR1A0w8qw51j4gJhOGT7AUjIf8NdVdygp9OEzWXILaSDE3%2Bgylkc10O2f0eZDvAWjQcKH72iF6PAWIEtX7MCgYAEoCY2jMXUsGUakihrZ%2Fg2%2B6wkHf%2BVM%2BT19bdAYGClyFhl9zm0QiAB3uSWqlG5pwHMkCJtgj%2FGk8%2BYde2ZWQixsncKIJmq1RvyS6RgLd1i7%2BcSaRDPvD30niTo5z1tQxgbeFa2pr0VrBjdoC7n9u5nupne8q6HCB6%2BGIlZNKC2YA%3D%3D" },
    });
    console.log('fileinfo');
    console.log(fileinfo);
    if (fileinfo) {
      const url = fileinfo.url;
      const fileId = fileinfo.id;
      const storageLocation = fileinfo.storage_location;

      // First we should delete the row from the database then remove the file from disk (or cloud)
      const result = await this.fileRepository.delete(fileId);
      // // Now lets remove the file from disk or (cloud)
      // if (storageLocation == 'onserver') {
      //   // this.helperService.deleteDiskFile(filePath);
      // } else if (storageLocation == 'cloud') {
      //   // this.helperService.deleteS3Object(fileinfo.url)
      // }
      console.log('database fileinfo deletion data');
      console.log(result);
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
    /////// Discard the api call if the user id is 0.
    /////// Check the controller why user_id can be 0 in some
    /////// cases (if the user is not loggedin , it can be 0)
    if (user_id == 0) {
      const errorMessage = 'provide valid authorization token in the header';
      const stream = new Readable();
      stream.push(errorMessage);
      stream.push(null);
      return stream;
    }
    /////// End of User id checking logic ///////

    ////////// Rate Limit business logic ///////////
    const user_info = await this.fetch_user_info({ user_id });
    const rate_limiter_flag = await this.helperService.rateLimiter({
      user_id: user_info.id,
      user_ip: user_ip,
    });
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
      console.log('fileInfo in get File service');
      console.log(fileInfo);
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
            user_id: user_info.id,
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
    uploader: number,
    uploader_ip: string,
    filename: string,
    storage_location: string,
    file: Buffer,
  ) {
    const uploaderObj = await this.userService.findUserbyId(uploader);
    if (!uploaderObj) {
      throw new BadRequestException('User is not valid to upload a file');
    }

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
    fileObj.uploader = uploaderObj;
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
    uploader: number,
    uploader_ip: string,
    filename: string,
    storage_location: string,
    file: Buffer,
  ) {
    const uploaderObj = await this.userService.findUserbyId(uploader);
    if (!uploaderObj) {
      throw new BadRequestException('User is not valid to upload a file');
    }

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
    fileObj.uploader = uploaderObj;
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
