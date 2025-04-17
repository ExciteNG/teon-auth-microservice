import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY, CLIENT_URL } from '@config';

import User, { IUser } from '@/models/users.model';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import {
  loginDto,
  resendVerificationDto,
  signupDto,
  verifyUserDto,
} from '@/validator/auth.validator';
import EmailService from './email.service';
import { HttpException } from '@/exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

class AuthService {
  public users = User;
  public emailService = new EmailService();

  public async signup(userData: signupDto['body']) {
    if (!userData)
      throw new HttpException(StatusCodes.BAD_REQUEST, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });

    if (findUser)
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        `This email ${userData.email} already exists`
      );

    const hashedPassword = await hash(userData.password, 10);

    const user = await this.users.create({
      ...userData,
      password: hashedPassword,
    });

    user.confirmationCode = this.createToken(user, 60 * 10).token;
    await user.save();

    this.emailService
      .sendEmail({
        to: user.email,
        subject: 'Verify email address',
        body: `Click on confirmation link: ${CLIENT_URL}/auth/verify-email/verify/${user.confirmationCode}. The code will expire in 10 minutes`,
      })
      .then((res) => {
        return { ...user, password: undefined, confirmationCode: undefined };
      })
      .catch((err) => {
        throw new HttpException(400, 'Error sending confirmation mail');
      });
  }

  public async verifyUser({
    confirmationCode,
  }: verifyUserDto['params']): Promise<IUser> {
    if (!confirmationCode)
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'confirmation code is empty'
      );

    const findUser: IUser = await this.users.findOne({ confirmationCode });

    if (!findUser)
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid token');

    try {
      verify(confirmationCode, SECRET_KEY);
    } catch (error) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        'Invalid or expired confirmation code'
      );
    }

    findUser.isVerified = true;
    findUser.emailVerified = true;
    findUser.confirmationCode = undefined;
    const verifiedUser = await findUser.save();

    return verifiedUser;
  }

  public async resendVerification(body: resendVerificationDto['body']) {
    if (!body)
      throw new HttpException(StatusCodes.BAD_REQUEST, 'body is empty');

    const user = await this.users.findOne({ email: body.email });

    if (!user)
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'User does not exist');

    if (user.isVerified)
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'User is already verified'
      );

    user.confirmationCode = this.createToken(user, 60 * 10).token;
    await user.save();

    this.emailService
      .sendEmail({
        to: user.email,
        subject: 'Verify email address',
        body: `Click on confirmation link: ${CLIENT_URL}/auth/verify-email/verify/${user.confirmationCode}. The code will expire in 10 minutes`,
      })
      .then((res) => {
        return { ...user, password: undefined, confirmationCode: undefined };
      })
      .catch((err) => {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          'Error resending verification mail'
        );
      });
  }

  public async login(
    userData: loginDto['body']
  ): Promise<{ cookie: string; user: IUser; token: string }> {
    if (!userData)
      throw new HttpException(StatusCodes.BAD_REQUEST, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });

    if (!findUser)
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        'Wrong email or password'
      );

    const isPasswordMatching = await compare(
      userData.password,
      findUser.password
    );

    if (!isPasswordMatching)
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        'Wrong email or password'
      );

    if (!findUser.isVerified) {
      findUser.confirmationCode = this.createToken(findUser).token;
      const user = await findUser.save();

      this.emailService
        .sendEmail({
          to: user.email,
          subject: 'Verify email address',
          body: `Click on confirmation link: ${CLIENT_URL}/auth/verify-email/verify/${user.confirmationCode}. The code will expire in 10 minutes`,
        })
        .catch((err) => {
          throw new HttpException(400, 'Error resending verification mail');
        });

      throw new HttpException(
        402,
        'Email is not verified, check mail for verification',
        { ...user, password: undefined }
      );
    }

    const user = await this.users
      .findById(findUser._id)
      .select('-password  -verificationToken -verificationTokenExpiry');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user, token: tokenData.token };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (!userData) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({
      email: userData.email,
      password: userData.password,
    });

    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`
      );

    return findUser;
  }

  public createToken(user: IUser, expire?: number): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    // const expiresIn: number = 60 * 60;
    const expiresIn: number = expire || 60 * 60;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
