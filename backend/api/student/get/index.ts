import { Response } from 'express';
import User from '../../../schemas/user.schema';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, ROLE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';

const endpoint = async (_: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid email or password.',
    endpoint: async (response) => {
      await connectToDatabase();

      const users = await User
        .find({ role: ROLE.STUDENT })
        .select('-password -__v -googleId -role -_id -deleted -isActive')
        .sort({ createdAt: -1 });

      if (users) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'Successfully.';
        response.data = users;
      }
    }
  });
};

export default endpoint;
