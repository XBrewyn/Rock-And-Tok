import { Response } from 'express';
import User from '../../../schemas/user.schema';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid email or password.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { questions = [] } = req.body;
      
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: { 
            updatedAt: Date.now(),
            'test.questions': questions,
            'test.dateStart': Date.now(),
            'test.isTest': false
          }
        },
        { new: true }
      );

      if (user) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message =  MESSAGE.SUCCESSFULLY;
      }
    }
  });
};

export default endpoint;
