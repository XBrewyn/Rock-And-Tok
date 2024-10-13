import { Request, Response } from 'express';
import User from '../../schemas/user.schema';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';

const endpoint = async (req: Request, res: Response) => {
  catchTry({
    res,
    message: 'User not found',
    endpoint: async (response) => {
      await connectToDatabase();
      // @ts-ignore
      const user = await User.findById(req.user._id, { password: 0, __v: 0 });
      // @ts-ignore
      if (user && req.user.type === 'auth') {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'Successfuly';
        response.data = user;
      }
    }
  });
};

export default endpoint;
