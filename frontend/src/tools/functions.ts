import { HTTP_STATUS_CODES, ROLE } from './const';
import { Request, RequestOptions, Send, Response, Role } from './type';

/**
 * Constructs a className string from multiple class name parts.
 * @param {...string} props - The class name parts to concatenate.
 * @returns {string} The concatenated class name string.
 */
const getClassName = (...props: string[]): string => {
  let classes: string = '';

  for (let prop of props)
    if (prop) classes += `${prop} `;

  return classes.trim();
}

/**
 * Determines if the current environment is development.
 * @returns {boolean} True if the environment is development, otherwise false.
 */
const isDev = (): boolean =>
  process.env.NODE_ENV
    ? process.env.NODE_ENV.includes('development')
    : false;

/**
 * Sends an HTTP request to the specified API.
 * @param {Request} params - The parameters for the request.
 * @returns {Send} An object containing methods for different HTTP methods (GET, POST, DELETE, PUT, PATCH).
 */
const send = ({ api, data, token }: Request): Send => {
  const options: RequestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: getFetchCredentialsBasedOnEnvironment(),
    method: 'GET',
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const request = async (options: RequestOptions): Promise<Response> => {
    try {
      const response: globalThis.Response = await fetch(`${getDomainBasedOnEnvironment()}/api/v1/${api}`, options);
      const responseData: Response = await response.json();

      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        response: {
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: `Error fetching data: ${error}`,
          data: [],
        }
      };
    }
  };

  return {
    get: (): Promise<Response> => {
      options.method = 'GET';
      return request(options);
    },

    post: (): Promise<Response> => {
      options.method = 'POST';
      return request(options);
    },

    delete: (): Promise<Response> => {
      options.method = 'DELETE';
      return request(options);
    },

    put: (): Promise<Response> => {
      options.method = 'PUT';
      return request(options);
    },

    patch: (): Promise<Response> => {
      options.method = 'PATCH';
      return request(options);
    },
  };
};

/**
 * Gets the appropriate domain based on the current environment.
 * @returns {string} The domain URL.
 */
const getDomainBasedOnEnvironment = (): string =>
  isDev() && process.env.HOST_DEV ? process.env.HOST_DEV : '';

/**
 * Gets the appropriate credentials setting for fetch requests based on the current environment.
 * @returns {'include' | 'same-origin'} The credentials setting.
 */
const getFetchCredentialsBasedOnEnvironment = (): 'include' | 'same-origin' =>
  isDev() ? 'include' : 'same-origin';

/**
 * Checks if the provided role is a student.
 *
 * @param {Role} role - The role to check.
 * @returns {boolean} True if the role is 'STUDENT', otherwise false.
 */
const isStudent = (role: Role): boolean =>
  role === ROLE.STUDENT;

/**
 * Checks if the provided role is a student.
 *
 * @param {Role} role - The role to check.
 * @returns {boolean} True if the role is 'STUDENT', otherwise false.
 */
const isAdmin = (role: Role): boolean =>
  role === ROLE.ADMIN;


/**
 * Checks if the user has signed out by checking if the role is null.
 *
 * @param {Role} role - The role to check (can be null when signed out).
 * @returns {boolean} True if the role is null, indicating sign-out, otherwise false.
 */
const isSignOut = (role: Role): boolean =>
  role === null;

/**
 * Formats an ISO date string into a more readable format.
 * 
 * @param {string} isoDate - The ISO date string to format (e.g., '2024-10-16T21:38:29.542Z').
 * @param {boolean} [is12HourFormat=false] - Whether to use 12-hour format with AM/PM. Defaults to 24-hour format.
 * @returns {string} The formatted date string (e.g., 'October 16, 2024, 21:38').
 */
function formatDate(isoDate: string, is12HourFormat: boolean = true): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: is12HourFormat,
  };

  return date.toLocaleString('en-US', options);
}

export {
  getClassName,
  send,
  isStudent,
  isSignOut,
  isAdmin,
  formatDate
};
