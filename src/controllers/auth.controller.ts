import { RequestWithUser } from '@/interfaces/auth.interface';
import { IUser } from '@/models/users.model';
import AuthService from '@/services/auth.service';
import {
  loginDto,
  resendVerificationDto,
  signupDto,
  verifyUserDto,
} from '@/validator/auth.validator';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  public authService = new AuthService(); // Assuming you have an AuthService class

  public signup = async (
    req: Request<any, any, signupDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.body; // Assuming the request body contains user data
      const signUpUserData = await this.authService.signup(userData); // Call the signup method from AuthService

      res.status(201).json({
        message: 'User created successfully',
        data: signUpUserData,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyUser = async (
    req: Request<verifyUserDto['params'], {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { confirmationCode } = req.params; // Assuming the request params contain confirmation code
      const verifiedUserData =
        await this.authService.verifyUser(confirmationCode); // Call the verifyUser method from AuthService

      res.status(200).json({
        message: 'User verified successfully',
        data: verifiedUserData,
      });
    } catch (error) {
      next(error);
    }
  };

  public resendVerification = async (
    req: Request<{}, {}, resendVerificationDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body; // Assuming the request body contains email
      const resendVerificationData =
        await this.authService.resendVerification(body); // Call the resendVerification method from AuthService

      res.status(200).json({
        message: 'Verification email resent successfully',
        data: resendVerificationData,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request<{}, {}, loginDto['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.body; // Assuming the request body contains user data
      const loggedinUserData = await this.authService.login(userData); // Call the signup method from AuthService

      res.setHeader('Set-Cookie', [loggedinUserData.cookie]);
      res.status(201).json({
        message: 'User loggedin successfully',
        data: loggedinUserData,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
