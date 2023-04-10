import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
  } from '@nestjs/common';
  import { CreateUserDTO } from './dto/create-user.dto';
  import { AuthService } from './auth.service';
  import { NotNullPipe } from './pipes/not-null.pipe';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('/signup')
    @UseInterceptors(ClassSerializerInterceptor)
    signup(
      @Body(ValidationPipe) createUserDTO: CreateUserDTO
      ) {
      return this.authService.signup(createUserDTO);
    }
  
    @Post('/signin')
    async signin(
      @Body('email', NotNullPipe) username: string,
      @Body('password', NotNullPipe) password: string,
    ) {
      return this.authService.signin(username, password);
    }
  }
  