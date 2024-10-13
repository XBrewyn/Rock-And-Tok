import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, VALIDATOR } from '../../tools/consts';
import { Field } from './type';
import { ObjectValueString, ResponseSend } from '../../tools/type';
import { connectToDatabase, getToken, send, setCookie, hash, getResponse, getLocation } from '../../tools/functions';
import User from '../../schemas/user.schema';

const endpoint = async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> => {
  const response: ResponseSend = getResponse(res, 'Validation failed, please check your input and try again.');
  let invalidFields: ObjectValueString = {};

  const {
    name = '',
    lastName = '',
    email = '',
    phone = '',
    password = '',
    favoriteRockGenre = ''
  } = req.body;

  const fields: Field[] = [
    { key: 'name', value: name, validator: VALIDATOR.NAME },
    { key: 'lastName', value: lastName, validator: VALIDATOR.LAST_NAME },
    { key: 'email', value: email, validator: VALIDATOR.EMAIL },
    { key: 'phone', value: phone, validator: VALIDATOR.PHONE_NUMBER },
    { key: 'password', value: password, validator: VALIDATOR.PASSWORD },
  ];

  fields.forEach(({ key, value, validator }: Field): void => {
    if (!validator.regExp.test(value)) {
      invalidFields[key] = validator.message;
    }
  });

  if (Object.keys(invalidFields).length) {
    response.data = invalidFields;
    return send(response);
  }

  try {
    await connectToDatabase();

    const user = new User({
      email: email.toLowerCase(),
      favoriteRockGenre: favoriteRockGenre.toLowerCase(),
      lastName: lastName.toLowerCase(),
      location: await getLocation(req),
      name: name.toLowerCase(),
      password: await hash.create(password),
      phone: phone.toLowerCase(),
    });

    await user.save();

    if (user) {
      setCookie({ res, expires: 30, value: getToken({ _id: user._id }) });
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Successfully';
      response.data = user;
    } else {
      response.message = 'Error saving user!';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    const errorMessage: string = `Error saving user! ${error}`;
    const field: RegExpMatchArray | null = errorMessage.match(/{.*}/);

    if (field && field[0]) {
      invalidFields = JSON.parse(
        field[0]
        .replace(/"[^"]+"/, '"This field is already in use."')
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
      );

      response.data = invalidFields;
    } else {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }

    response.message = errorMessage;
  }

  return send(response);
};

export default endpoint;
