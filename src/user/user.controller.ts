import { Controller, Get, Headers, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  async getUsers(): Promise<User[]> {
    const allUsers: User[] = await this.userService.getUsers();
    return allUsers;
  }


}
