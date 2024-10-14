import { Request, Response, NextFunction } from 'express';

const endpoint = (_: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: https://lh3.googleusercontent.com");
  next();
}

export default endpoint;
