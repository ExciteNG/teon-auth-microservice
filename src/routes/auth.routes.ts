import AuthController from '@/controllers/auth.controller';
import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - phoneNumber
 *         - country
 *         - userType
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         country:
 *           type: string
 *           description: User's country
 *         userType:
 *           type: string
 *           enum: [Offtaker, Miner, Farmer, GemExcite]
 *           description: User type
 *       example:
 *         email: user@example.com
 *         password: StrongP@ssw0rd
 *         phoneNumber: +2349012345678
 *         country: Nigeria
 *         userType: Offtaker
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: user@example.com
 *         password: StrongP@ssw0rd
 *     ResendVerificationRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *       example:
 *         email: user@example.com
 */

class AuthRoutes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     summary: Sign up a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupRequest'
     *     responses:
     *       201:
     *         description: User signed up successfully
     *       400:
     *         description: Invalid input data
     */
    this.router.post(`${this.path}/register`, this.authController.signup);

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Log in a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       401:
     *         description: Invalid credentials
     */
    this.router.post(`${this.path}/login`, this.authController.login);
  }
}

export default AuthRoutes;
