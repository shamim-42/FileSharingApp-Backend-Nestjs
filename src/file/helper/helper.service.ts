import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileAccess } from '../file-acces.entity';
import * as moment from 'moment';
import { unlink } from 'fs/promises';

@Injectable()
export class HelperService {
  constructor(
    @InjectRepository(FileAccess)
    private fileAccessRepository: Repository<FileAccess>,
  ) {}

  generateRSAKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'der',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der',
      },
    });

    return {
      publicKey: publicKey.toString('base64'),
      privateKey: privateKey.toString('base64'),
    };
  }

  generateSimpleKeyPair(): { publicKey: string; privateKey: string } {
    const publicKey = crypto.randomBytes(8).toString('hex');
    const privateKey = crypto.randomBytes(8).toString('hex');
    return { publicKey, privateKey };
  }

  isRSAPublicKey(str) {
    let pubKey = `-----BEGIN PUBLIC KEY-----\n${str}\n-----END PUBLIC KEY-----`;
    try {
      const key = crypto.createPublicKey(pubKey);
      return key.type === 'public' && key.asymmetricKeyType === 'rsa';
    } catch {
      return false;
    }
  }

  async rateLimiter({ user_id, user_ip }) {
    const download_limit = parseInt(process.env.DOWNLOAD_LIMIT);
    const download_limit_duration = parseInt(
      process.env.DOWNLOAD_LIMIT_DURATION.slice(0, -3),
    );
    
    const access_data = await this.fileAccessRepository.find({
      where: { user_ip: user_ip },
      order: {
        id: 'DESC',
      },
      take: download_limit, // take is mimic of sql limit
    });

    console.log('access data');
    console.log(access_data)
    // For the first time, no access data we will find. So, rate_limiter should be false.
    if(access_data.length == 0){
      console.log(access_data.length)
      return false
    }
    console.log(access_data.length)

    const last_access_date_time =
      access_data[access_data.length - 1].access_time;
    const givenTime = moment(last_access_date_time);
    const now = moment();
    const last_access_in_minutes = now.diff(givenTime, 'minutes');
    console.log('givent time: last access time');
    console.log(givenTime);

    console.log('now');
    console.log(now)
    if (last_access_in_minutes > download_limit_duration) {
      return false;
    }
    return true;
  }

  async addEntryInFileAccessTable({
    user_id = null,
    user_ip = null,
    access_time = null,
    access_file_id = null,
  }) {
    // const now = moment.tz(process.env.TIMEZONE);
    const now = moment();
    const formatted_dt = now.format('YYYY-MM-DD HH:mm:ss');
    const fileAccessObj = new FileAccess();
    // fileAccessObj.access_by = user_id;
    fileAccessObj.user_ip = user_ip;
    fileAccessObj.access_time = formatted_dt; // TYPEORM will automatically fill this field with current date time
    // fileAccessObj.accessed_file = access_file_id // this field is nullable. I am not populating this field at this moment. If needed it can be upgraded later
    const data = await this.fileAccessRepository.save(fileAccessObj);
    console.log(data)
  }
}
