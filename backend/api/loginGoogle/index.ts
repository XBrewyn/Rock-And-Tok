import { Request, Response } from 'express';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import User from '../../schemas/user.schema';
import { connectToDatabase, getResponse, getToken, send, setCookie } from '../../tools/functions';
import { ResponseSend } from '../../tools/type';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const { GOOGLE_ID_CLIENT = '' } = process.env;
const client = new OAuth2Client(GOOGLE_ID_CLIENT);

const endpoint = async (req: Request, res: Response) => {
  const { token = '' } = req.body;
  const response: ResponseSend = getResponse(res, 'This account does not exist.');

  try {
    await connectToDatabase();

    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_ID_CLIENT,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    const { sub = '' } = payload || {};
    const user = await User.findOne({ googleId: sub }, { password: 0, __v: 0 });

    if (user) {
      setCookie({ res, expires: 30, value: getToken({ _id: user._id }) });
      response.data = user;
      response.message = 'Successfully';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.data = { password: response.message };
    }
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error ${error}`;
  }

  send(response);
}

export default endpoint;
