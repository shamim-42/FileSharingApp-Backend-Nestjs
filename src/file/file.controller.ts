import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import jwt_decode from 'jwt-decode';
import { FileService } from './file.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { HelperService } from './helper/helper.service';
import slugify from 'slugify';

@Controller()
export class FileController {
  constructor(
    private fileService: FileService,
    private helperService: HelperService,
  ) {}

  @Get(['files/:publickey', 'filesRSA/:publickey'])
  async getFile(
    @Headers() headers: Record<string, string>,
    @Param('publickey') publickey: string,
    @Req() request,
    @Res() response: Response,
  ) {
    let pubKey: string = publickey;
    const user_ip = request.ip; // extracting client ipv6

    /****** We have two different route for this same method. Needs to check whether 
    filesRSA route is being called. If so we need to check whether the user
    providing valied RSA public key or not ********/ 
    const url_identifier = request.route.path.split('/').slice(1, 2);
    if (url_identifier == 'filesRSA') {
      const flag = this.helperService.isRSAPublicKey(pubKey);
      if (flag) {
        pubKey = decodeURIComponent(publickey);
      } else {
        throw new BadRequestException(
          "Provided key is not RSA public key. Please try '/files/:pubkey' url if you have a simple public key instead of RSA one.",
        );
      }
    }
    /****** RSA Public key validation check done **********/
    const user_id = null //as this version is without authentication, we are keeping user_id null
    const data = await this.fileService.getFile(pubKey, user_id, user_ip);

    // S3 Object delivering as stream
    return data.pipe(response);

    // Disk stored object delivering as stream
    return data.pipe(response);
  }

  @Delete('files/:privatekey')
  // @HttpCode(204)
  async deletePhoto(
      @Param('privatekey') privatekey: string,
  ) {
      return await this.fileService.deleteFile(privatekey);
  }

  @Post('filesRSA/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileRSA(
    @Headers() headers: Record<string, string>,
    @Req() request,
    @Body('storage_location') storage_location: string,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const uploader_ip = request.ip; // keeping static for the time being
    const filename = file.originalname;
    const result = await this.fileService.saveFileRSA(
      uploader_ip,
      filename,
      storage_location,
      file.buffer,
    );
    return result;
  }

  @Post('files/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Headers() headers: Record<string, string>,
    @Req() request,
    @Body('storage_location') storage_location: string,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const uploader_ip = request.ip; // keeping static for the time being
    const filename = slugify(file.originalname);

    const result = await this.fileService.saveFile(
      uploader_ip,
      filename,
      storage_location,
      file.buffer,
    );
    return result;
  }
}
