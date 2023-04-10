import { Injectable } from '@nestjs/common';
import { Awss3Service } from './awss3.service';
import { DiskWriteService } from './diskWrite.service';

@Injectable()
export class FileUploadService {
  constructor(
    private awss3Service: Awss3Service,
    private diskWriteService: DiskWriteService,
  ) {}

  async getObjectFromS3Url(s3Url) {
    const obj = await this.awss3Service.getObjectFromS3Url(s3Url);
    return obj;
  }

  async uploadFileToS3(filename: string, file: Buffer) {
    const data = await this.awss3Service.uploadPublicFile(
      filename ? filename : 'justafilename',
      file,
    );
    return data;
  }

  async storeFileInDisk(filename: string, file: Buffer) {
    const data = await this.diskWriteService.saveFile(
      filename ? filename : 'justafilename',
      file,
    );
    return data;
  }

  async deleteFileFrom({fileUrl, storageLocation}){
    console.log('file url');
    console.log(fileUrl)
    if(storageLocation == 'onserver'){
        await this.diskWriteService.deleteFileFromDisk(fileUrl)
    } else if (storageLocation == 'cloud'){
        await this.awss3Service.deleteObjectFromS3(fileUrl)
    }
    return {
        "status_code": 204,
        "message": "Successfully Deleted!"
    }
  }
}
