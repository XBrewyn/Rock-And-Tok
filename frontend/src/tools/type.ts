import { HTTP_STATUS_CODES, ROLE } from "./const";

type Role = typeof ROLE.ADMIN | typeof ROLE.STUDENT | null;

type ObjectValueString = {
  [key: string]: string;
};

type ObjectValueNumber = {
  [key: string]: number;
};

type Request = {
  api: string;
  data?: object;
  token?: string;
};

type Send = {
  get: () => Promise<Response>;
  post: () => Promise<Response>;
  delete: () => Promise<Response>;
  put: () => Promise<Response>;
  patch: () => Promise<Response>;
};

type RequestOptions = {
  method: string;
  credentials: 'same-origin' | 'include', 
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
}

type Response = {
  response: {
    statusCode: 
      typeof HTTP_STATUS_CODES.OK |
      typeof HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR |
      typeof HTTP_STATUS_CODES.BAD_REQUEST |
      typeof HTTP_STATUS_CODES.UNAUTHORIZED |
      typeof HTTP_STATUS_CODES.NOT_FOUND |
      typeof HTTP_STATUS_CODES.TEMPORARY_REDIRECT;
    data: any;
    message: string;
  }
}

type Validator = {
  [key: string]: {
    message: string;
    regExp: RegExp;
  };
}

export type {
  ObjectValueString,
  ObjectValueNumber,
  Request,
  Send,
  RequestOptions,
  Response,
  Role,
  Validator,
};
