
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from "jwt-decode";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    if (!token) {
      return false;
    }
    token = token.slice(7);
    let data: any = jwt_decode(token)

    if(roles.includes(data.role)){
      return true;
    }
    return false;
  }
}