import express, { Response, Request, Express } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODES, ROLE } from './consts';
import { Cookie, ResponseSend, Token, Location, TryCatch } from './type';
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

let isConnected: any;

/**
 * Connects to the MongoDB database if not already connected.
 * 
 * This function uses the appropriate MongoDB URI based on the environment (development or production).
 * It also configures a small connection pool for efficient database connections.
 * 
 * @returns {Promise<void>} A promise that resolves once the connection is attempted.
 * @throws Will throw an error if there's a problem connecting to MongoDB.
 */
const connectToDatabase = async (): Promise<void> => {
  // Check if already connected
  if (isConnected) {
    return;
  }

  try {
    // Determine the appropriate MongoDB URI based on the environment
    const MONGODB_URI: string = isDev()
      ? MONGODB_URI_DEVELOPMENT
      : MONGODB_URI_PRODUCTION;

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      minPoolSize: 1,
      maxPoolSize: 1,
    });

    // Set connection status
    isConnected = mongoose.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

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

/**
 * Initializes the database by ensuring an admin user exists.
 * 
 * This function checks if an admin user with the name 'admin' already exists in the database.
 * If no admin user is found, it creates one with the specified credentials and logs the success message.
 * 
 * @returns {Promise<void>} A promise that resolves once the initialization process is completed.
 * @throws Will throw an error if there is a problem with the database operation.
 */
const initialDatabase = async (): Promise<void> => {
  try {
    // Check if an admin user already exists
    let admin = await User.findOne({ name: 'admin' });

    // If no admin is found, create one
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
  } catch (error: any) {
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

/**
 * Retrieves the location details (country, city, region) based on the request's IP address.
 * 
 * This function extracts the IP address from the request headers and fetches the location data
 * from the ipinfo.io API.
 * 
 * @param {Request} req - The request object containing headers to extract the IP address from.
 * @returns {Promise<Location>} A promise that resolves to a location object containing country, city, and region.
 * @throws Will throw an error if there is an issue with the API request or response.
 */
const getLocation = async (req: Request): Promise<Location> => {
  // Extract IP address from headers
  const ip: string | string[] | undefined = req.headers['x-forwarded-for'] || '';

  // Fetch location data from ipinfo.io API
  const { country, city, region } = await fetch(`https://ipinfo.io/${ip}?token=52df5d679dc04f`)
    .then(res => res.json());

  // Return the location object
  return {
    country,
    city,
    region
  };
};

/**
 * Executes an async function wrapped in a try-catch block, handles errors and sends a response.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Response} params.res - The HTTP response object to be used for sending responses.
 * @param {string} params.message - The message to include in the initial response.
 * @param {(response: ResponseSend) => Promise<any>} params.endpoint - An async function to be executed, receiving a response object.
 *
 * @returns {Promise<void>} Resolves after the endpoint function is executed or after an error is handled.
 */
async function catchTry({ res, message, endpoint }: TryCatch) {
  const response: ResponseSend = getResponse(res, message);

  try {
    await endpoint(response);
  }  catch(error) {
    response.message = `Error ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
}

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
  getLocation,
  catchTry
};
