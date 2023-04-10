import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findUserbyEmail(email: string) {
        const user = await this.userRepository.findOne({
            select: ['id', 'fullname', 'email'],
            where: { email: email }
        });
        return user;
    }

    async findUserbyId(id: number) {
        const user = await this.userRepository.findOne({
            select: ['id', 'fullname', 'email'],
            where: { id: id }
        });
        return user;
    }

    async saveUser(user: User) {
        return await this.userRepository.save(user);
    }

    async findByUsernameOrEmail(username: string): Promise<User> {
        const data = this.userRepository
            .createQueryBuilder('users')
            .where('users.email= :username', { username })
            .getOne();
        // .execute()
        return data;

    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find();
        // return this.userRepository.manager.find(User)
    }
}
