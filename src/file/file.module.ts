import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileUploadService } from './file-upload/file-upload.service';
import { Awss3Service } from './file-upload/awss3.service';
import { DiskWriteService } from './file-upload/diskWrite.service';
import { HelperService } from './helper/helper.service';
import { FileAccess } from './file-acces.entity';
// import { ElastiCacheService } from './helper/elasticache.service.ts.bkp';

@Module({
  imports: [
    UserModule,
    FileModule,
    TypeOrmModule.forFeature([File, FileAccess]),
  ],
  providers: [
    FileService,
    FileUploadService,
    Awss3Service,
    DiskWriteService,
    HelperService,
    // ElastiCacheService,
  ],
  controllers: [FileController],
  exports: [FileService]
})
export class FileModule { }
