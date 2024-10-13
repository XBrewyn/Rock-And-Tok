import { Request, Response } from 'express';
import User from '../../schemas/user.schema';
import { catchTry, connectToDatabase, getToken, hash,  setCookie } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const endpoint = async (req: Request, res: Response) => {
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
        response.message = 'Successfuly';
        response.data = user;
      }
    }
  });
};

export default endpoint;
