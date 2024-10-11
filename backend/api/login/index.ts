import { Request, Response } from 'express';
import User from '../../schemas/user.schema';
import { connectToDatabase, getResponse, getToken, hash, send, setCookie } from '../../tools/functions';
import { ObjectValueString, ResponseSend } from '../../tools/type';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const endpoint = async (req: Request, res: Response) => {
  const { email = '', password = '' } = req.body;
  const response: ResponseSend = getResponse(res, 'User not found');
  const errorMessage: ObjectValueString = { password: 'Invalid email or password.' }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() }).select({ __v: 0 });

    if (user && (await hash.compare({ password, hash: user.password || '' }))) {
      setCookie({ res, expires: 30, value: getToken({ _id: user._id }) });
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Successfuly';
      response.data = user;
    } else {
      response.data = errorMessage;
    }
  } catch(e) {
    response.message = `Error ${e}`;
    response.data = errorMessage;
  }

  send(response);
};

export default endpoint;
