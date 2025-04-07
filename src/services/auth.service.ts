import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';

import User, { IUser } from '@/models/users.model';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';

class AuthService {
  public users = User;

  public async signup(userData: any) {
    if (!userData) throw new Error('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new Error(`This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const user = await this.users.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  public async login(userData: any) {
    if (!userData) throw new Error('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new Error('Wrong email or password');

    const isPasswordMatching = await compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching) throw new Error('Wrong email or password');

    const tokenData = this.createToken(findUser);
    return { token: tokenData };
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

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
