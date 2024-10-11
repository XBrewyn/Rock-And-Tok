import { Router } from './type';
import { ENDPOINT } from '../tools/consts';
import register from '../api/signUp';
import signOut from '../api/signOut';
import login from '../api/login';
import auth from '../api/auth';
import signUpGoogle from '../api/signUpGoogle';
import loginGoogle from '../api/loginGoogle';

const config: Router[] = [
  {
    path: ENDPOINT.LOGIN,
    method: 'post',
    func: login,
  },
  {
    path: ENDPOINT.AUTH,
    method: 'post',
    func: auth,
  },
  {
    path: ENDPOINT.SING_UP,
    method: 'post',
    func: register,
  },
  {
    path: ENDPOINT.SING_UP,
    method: 'post',
    func: register,
  },
  {
    path: ENDPOINT.SING_OUT,
    method: 'post',
    func: signOut,
  },
  {
    path: ENDPOINT.SING_UP_GOOGLE,
    method: 'post',
    func: signUpGoogle,
  },
  {
    path: ENDPOINT.LOGIN_GOOGLE,
    method: 'post',
    func: loginGoogle,
  },
];

export default config;
