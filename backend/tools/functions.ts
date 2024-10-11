import express, { Response, Request, Express } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODES, ROLE } from './consts';
import { Cookie, ResponseSend, Token, Location } from './type';
import User from '../schemas/user.schema';

const {
  NODE_ENV = '',
  MONGODB_URI_PRODUCTION = '',
  MONGODB_URI_DEVELOPMENT = '',
  ACCESS_KEY_TOKEN = '',
  ADMIN_USERNAME = '',
  ADMIN_NAME = '',
  ADMIN_LASTNAME = '',
  ADMIN_EMAIL = '',
  ADMIN_PHONE = '',
  ADMIN_PASSWORD = '',
  TOKEN_NAME = ''
} = process.env;

/**
 * Checks if the environment is in development mode.
 * @returns {boolean} - True if in development mode, otherwise false.
 */
const isDev = (): boolean =>
  !!(NODE_ENV && NODE_ENV.includes('DEVELOPMENT'));

/**
 * Serves the application in production mode by setting up static file serving 
 * and handling any unmatched routes to return the index.html file.
 * @returns {void}
 */
const serveApp = (app: Express): void => {
  const BUILD_PATH: string = '../build';

  app.use(express.static(path.join(__dirname, BUILD_PATH)));
  app.get('*', (_: Response, res: Request) =>
    // @ts-ignore
    res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'))
  );
};

/**
 * Sends a JSON response.
 * @param {Object} param
 * @param {Object} param.res - Express response object.
 * @param {number} [param.statusCode=HTTP_STATUS_CODES.OK] - HTTP status code.
 * @param {Object|null} [param.data=null] - Data to include in the response.
 * @param {string} [param.message=''] - Message to include in the response.
 */
const send = ({
  res,
  statusCode = HTTP_STATUS_CODES.OK,
  data = null,
  message = '',
}: ResponseSend): express.Response<any, Record<string, any>> =>
  res.status(statusCode).json({ response: { statusCode, data, message } });

let isConnected: any;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGODB_URI: string = isDev()
      ? MONGODB_URI_DEVELOPMENT
      : MONGODB_URI_PRODUCTION;

    await mongoose.connect(MONGODB_URI, {
      minPoolSize: 1,
      maxPoolSize: 1,
    });
    isConnected = mongoose.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

/**
 * Hashing utility for creating and comparing hashed values.
 */
const hash = {
  /**
   * Creates a hash from a given value.
   * @param {string} value - Value to hash.
   * @returns {Promise<string>} - Hashed value.
   */
  create: async (value: string): Promise<any> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  },

  /**
   * Compares a password with a hashed value.
   * @param {Object} param
   * @param {string} param.password - Plain text password.
   * @param {string} param.hash - Hashed value.
   * @returns {Promise<boolean>} - True if the password matches the hash, otherwise false.
   */
  compare: async ({ password, hash }: { password: string; hash: string; }): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error comparing hash:', error);
      return false;
    }
  },
};

const initialDatabase = async () => {
  try {
    let admin = await User.findOne({ name: 'admin' });

    if (!admin) {
      admin = await User.create({
        username: ADMIN_USERNAME,
        name: ADMIN_NAME,
        lastname: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: await hash.create(ADMIN_PASSWORD),
        role: ROLE.ADMIN,
      });
      console.log('Admin inserted successfully');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Generates a JWT token.
 * @param {Object} param
 * @param {string} param.id - User ID or unique identifier.
 * @param {string} [param.type='auth'] - Token type (e.g., 'auth', 'refresh').
 * @param {string} [param.expiresIn='30d'] - Token expiration time.
 * @returns {string} - JWT token.
 */
const getToken = ({ _id, role = ROLE.STUDENT, type = 'auth', expiresIn = '30d' }: Token): string =>
  jwt.sign({ _id, role, type }, ACCESS_KEY_TOKEN, { expiresIn });

/**
 * Sets a cookie in the response.
 * @param {Object} param
 * @param {Object} param.res - Express response object.
 * @param {Object} param.value - Value to store in the cookie.
 * @param {number} [param.expires=30] - Expiration time in days.
 */
const setCookie = ({
  res,
  value,
  expires = 30,
}: Cookie) => {
  const expiryDate: Date = new Date();

  expiryDate.setDate(expiryDate.getDate() + expires);
  // @ts-ignore
  res.cookie(TOKEN_NAME, JSON.stringify(value), {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiryDate,
  });
};

/**
 * Authentication utility for managing JWT cookies.
 * @param {Object} res - Express response object.
 * @param {Object} req - Express request object.
 * @returns {Object} - Object with `remove` and `get` methods for handling JWT cookies.
 */
const auth = (res: Response, req: Request) => ({
  /**
   * Removes the authentication cookie.
   */
  remove: (): void => {
    res.clearCookie(TOKEN_NAME);
  },

  /**
   * Retrieves the authentication token from cookies.
   * @returns {string|null} - Token string or null if not found.
   */
  get: (): string | null => {
    const token = req.cookies[TOKEN_NAME];

    return token ? token.replace(/"/g, '') : null;
  },
});

/**
 * Creates a response object with a bad request status.
 * @param {Object} res - Express response object.
 * @param {string} [message=''] - Message to include in the response.
 * @returns {Object} - Response object.
 */
const getResponse = (res: Response, message: string = '') => ({
  data: null,
  res,
  message,
  statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
});

const getLocation = async (req: Request): Promise<Location> => {
  const ip: string | string[] | undefined = req.headers['x-forwarded-for'] || '';

  const { country, city, region } = await fetch(`https://ipinfo.io/${ip}?token=52df5d679dc04f`)
    .then(res => res.json());

  return {
    country,
    city,
    region
  };
};


export {
  isDev,
  serveApp,
  connectToDatabase,
  send,
  initialDatabase,
  getToken,
  setCookie,
  auth,
  hash,
  getResponse,
  getLocation
};
