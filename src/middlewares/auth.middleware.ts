import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { HttpException } from '../exceptions/HttpException';
import {
  DataStoredInToken,
  RequestWithUser,
} from '../interfaces/auth.interface';
import User from '../models/users.model';
import { StatusCodes } from 'http-status-codes';

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await User.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(
          new HttpException(
            StatusCodes.UNAUTHORIZED,
            'Wrong authentication token'
          )
        );
      }
    } else {
      next(
        new HttpException(StatusCodes.NOT_FOUND, 'Authentication token missing')
      );
    }
  } catch (error) {
    next(
      new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token')
    );
  }
};

export default authMiddleware;
