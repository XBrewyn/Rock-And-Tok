import { ObjectValueNumber, ObjectValueString, Validator } from './type';

const VALIDATOR: Validator = {
  USERNAME: {
    message: 'Please enter a valid username.',
    regExp: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
  },
  EMAIL: {
    message: 'Please enter a valid email address.',
    regExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE_NUMBER: {
    message: 'Please enter a valid phone number.',
    regExp: /^\+?\d{1,3}[- ]?\(?\d{1,3}\)?[- ]?\d{3,5}[- ]?\d{4}$/
  },
  NAME: {
    message: 'Please enter a valid name.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  LAST_NAME: {
    message: 'Please enter a valid last name.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  PASSWORD: {
    message: 'Your password must be at least 8 characters long.',
    regExp: /^.{8,}$/
  },
};

const HTTP_STATUS_CODES: ObjectValueNumber = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TEMPORARY_REDIRECT: 307,
};


const ROLE: ObjectValueString = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
};

export {
  ROLE,
  VALIDATOR,
  HTTP_STATUS_CODES
};
