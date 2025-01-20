import { Request } from 'express';
import { UserFromJwt } from './user-jwt.interface';

export interface RequestWithUser extends Request {
  user: UserFromJwt;
}
