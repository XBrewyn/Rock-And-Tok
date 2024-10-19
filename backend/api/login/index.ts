import { Response } from 'express';
import User from '../../schemas/user.schema';
import { catchTry, connectToDatabase, getToken, hash,  setCookie } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid email or password.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { email = '', password = '' } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() }).select({ __v: 0 });

      response.data = { password: response.message };

      if (user && (await hash.compare({ password, hash: user.password || '' }))) {
        setCookie({ res, value: getToken({ _id: user._id }) });
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message =  MESSAGE.SUCCESSFULLY;
        response.data = user;
      }
    }
  });
};

export default endpoint;
