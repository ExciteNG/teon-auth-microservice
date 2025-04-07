import AuthService from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  public authService = new AuthService(); // Assuming you have an AuthService class

  async signup(req: Request<any, any>, res: Response, next: NextFunction) {
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
  }

  async login(req: Request<any, any>, res: Response, next: NextFunction) {
    try {
      const userData = req.body; // Assuming the request body contains user data
      const loggedinUserData = await this.authService.login(userData); // Call the signup method from AuthService

      res.status(201).json({
        message: 'User loggedin successfully',
        data: loggedinUserData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
