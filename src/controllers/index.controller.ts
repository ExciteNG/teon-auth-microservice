import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send('Welcome to Teon Suites Auth Service');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
