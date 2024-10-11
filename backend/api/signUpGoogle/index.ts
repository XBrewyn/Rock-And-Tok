import { Request, Response } from 'express';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import User from '../../schemas/user.schema';
import { getLocation, getResponse, getToken, send, setCookie } from '../../tools/functions';
import { ResponseSend } from '../../tools/type';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const { GOOGLE_ID_CLIENT = '' } = process.env;
const client = new OAuth2Client(GOOGLE_ID_CLIENT);

// Route to handle Google login
const endpoint = async (req: Request, res: Response) => {
  const { token = '' } = req.body;
  const response: ResponseSend = getResponse(res, 'Validation failed, please check your input and try again.');

  try {
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_ID_CLIENT,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    const { sub = '', email = '', given_name = '', family_name = '', picture = '' } = payload || {};
    const message: string = 'This account is already registered.';
    let user;

    user = await User.findOne({ googleId: sub }, { password: 0, __v: 0 });

    if (user) {
      response.message = message;
      response.data = { password: message };
      return send(response);
    }

    user = new User({
      googleId: sub,
      name: given_name.toLowerCase(),
      lastName: family_name.toLowerCase(),
      email: email.toLowerCase(),
      photo: picture,
      location: await getLocation(req),
    });

    await user.save();

    setCookie({ res, expires: 30, value: getToken({ _id: user._id }) });
    response.data = user;
    response.message = 'Successfully';
    response.statusCode = HTTP_STATUS_CODES.OK;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error ${error}`;
  }

  send(response);
}

export default endpoint;
