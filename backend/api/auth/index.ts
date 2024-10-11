import { Request, Response } from 'express';
import User from '../../schemas/user.schema';
import { connectToDatabase, getResponse, send } from '../../tools/functions';
import { ResponseSend } from '../../tools/type';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const endpoint = async (req: Request, res: Response) => {
  const response: ResponseSend = getResponse(res, 'User not found');

  try {
    await connectToDatabase();
    // @ts-ignore
    const user = await User.findById(req.user._id, { password: 0, __v: 0 });
    // @ts-ignore
    if (user && req.user.type === 'auth') {
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Successfuly';
      response.data = user;
    }
  } catch(error) {
    response.message = `Error ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};

export default endpoint;
