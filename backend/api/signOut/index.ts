import { Response } from 'express';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { send, auth } from '../../tools/functions';
import { RequestType } from '../../tools/type';

const endpoint = (req: RequestType, res: Response): void => {
  const token = auth(res, req);

  token.remove();

  send({
    res,
    statusCode: HTTP_STATUS_CODES.OK,
    message:  MESSAGE.SUCCESSFULLY,
    data: null,
  });
};

export default endpoint;
