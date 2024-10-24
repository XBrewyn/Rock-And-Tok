import { Response, Request } from 'express';
import { HTTP_STATUS_CODES, ROLE } from './consts';
import { ObjectId } from 'mongodb';

type ObjectValueString = {
  [key: string]: string;
};

type Token = {
  _id: ObjectId;
  type?: 'auth';
  expiresIn?: string;
  role?: typeof ROLE.ADMIN | typeof ROLE.STUDENT;
};

type ResponseSend = {
  res: Response;
  statusCode?:
    | typeof HTTP_STATUS_CODES.OK
    | typeof HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    | typeof HTTP_STATUS_CODES.BAD_REQUEST
    | typeof HTTP_STATUS_CODES.UNAUTHORIZED
    | typeof HTTP_STATUS_CODES.NOT_FOUND
    | typeof HTTP_STATUS_CODES.TEMPORARY_REDIRECT;
  data?: any;
  message?: string;
};

type Cookie = {
  res: Response;
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

type RequestType = Request & {
  user: {
    type: string;
    _id: string | ObjectId;
  };
};

type HttpStatusCodes = {
  OK: 200;
  INTERNAL_SERVER_ERROR: 500;
  BAD_REQUEST: 400;
  UNAUTHORIZED: 401;
  NOT_FOUND: 404;
  TEMPORARY_REDIRECT: 307;
};

type Roles = {
  ADMIN: 'ADMIN';
  STUDENT: 'STUDENT';
};

type Endpoints = {
  AUTH: 'auth';
  SING_UP: 'sign-up';
  SING_UP_GOOGLE: 'sign-up-google';
  LOGIN_GOOGLE: 'login-google';
  SING_OUT: 'sign-out';
  LOGIN: 'login';
  STUDENT_TEST: 'student-test';
  STUDENT_GET: 'student-get';
};

type Validators = {
  USERNAME: Validator;
  EMAIL: Validator;
  PHONE_NUMBER: Validator;
  NAME: Validator;
  LAST_NAME: Validator;
  PASSWORD: Validator;
};

export type {
  ObjectValueString,
  ResponseSend,
  Token,
  Cookie,
  Location,
  Validator,
  TryCatch,
  RequestType,
  HttpStatusCodes,
  Roles,
  Endpoints,
  Validators,
};
