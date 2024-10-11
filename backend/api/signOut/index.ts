import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { send, auth } from '../../tools/functions';

const endpoint = (req: Request, res: Response): void => {
  const token = auth(res, req);

  token.remove();

  send({
    res,
    statusCode: HTTP_STATUS_CODES.OK,
    message: 'Successfully',
    data: null,
  });
};

export default endpoint;
