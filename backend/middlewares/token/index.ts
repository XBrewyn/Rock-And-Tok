import { NextFunction, Request, Response } from 'express';
import { auth } from '../../tools/functions';
import { ENDPOINT } from '../../tools/consts';
import { url, verifyToken } from './functions';
import { TokenOpcion } from './type';

const endpoint = async (req: Request, res: Response, next: NextFunction) => {
  const authenticator = auth(res, req);
  const isEndpoint = url(req);
  const tokenFromCookie = authenticator.get();
  const verifyTokenOpcion: TokenOpcion = {
    req,
    res,
    next,
    authenticator
  };

  if (
    tokenFromCookie && (
      isEndpoint(ENDPOINT.AUTH)
    )
  ) {
    return verifyToken(verifyTokenOpcion, tokenFromCookie);
  }

  return next();
};

export default endpoint;
