import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORMCONFIG } from './config/typeorm.config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    FileModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(TYPEORMCONFIG),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
