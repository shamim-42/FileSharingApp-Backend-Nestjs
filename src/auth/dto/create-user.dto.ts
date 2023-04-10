import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDTO {
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  password: string;
}
