import { Response } from 'express';
import { HTTP_STATUS_CODES, ROLE } from './consts';
import { ObjectId } from 'mongodb';

type ObjectValueString = {
  [key: string]: string;
};

type ObjectValueNumber = {
  [key: string]: number;
};

type ObjectValuValidator = {
  [key: string]: Validator;
};

type Token = {
  _id: ObjectId;
  type?: 'auth';
  expiresIn?: string;
  role?: (
    typeof ROLE.ADMIN |
    typeof ROLE.STUDENT
  ),
};

type ResponseSend = {
  res: Response; 
  statusCode?: (
    typeof HTTP_STATUS_CODES.OK |
    typeof HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR |
    typeof HTTP_STATUS_CODES.BAD_REQUEST |
    typeof HTTP_STATUS_CODES.UNAUTHORIZED |
    typeof HTTP_STATUS_CODES.NOT_FOUND |
    typeof HTTP_STATUS_CODES.TEMPORARY_REDIRECT 
  );
  data?: any;
  message?: string;
};

type Cookie = {
  res: Response,
  value: string;
  expires?: number;
};

type Location = {
  country: string;
  city: string;
  region: string;
};

type Validator = {
  message: string;
  regExp: RegExp;
};

type TryCatch = {
  res: Response;
  message: string;
  endpoint: (response: ResponseSend) => Promise<any>;
};

export type {
  ObjectValueString,
  ObjectValueNumber,
  ResponseSend,
  Token,
  Cookie,
  Location,
  Validator,
  ObjectValuValidator,
  TryCatch
};
