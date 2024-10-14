import { Router } from './type';
import { ENDPOINT } from '../tools/consts';
import register from '../api/signUp';
import signOut from '../api/signOut';
import login from '../api/login';
import auth from '../api/auth';
import signUpGoogle from '../api/signUpGoogle';
import loginGoogle from '../api/loginGoogle';
import studentTest from '../api/student/test';
import studentGet from '../api/student/get';

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
  {
    path: ENDPOINT.STUDENT_TEST,
    method: 'patch',
    func: studentTest,
  },
  {
    path: ENDPOINT.STUDENT_GET,
    method: 'get',
    func: studentGet,
  },
];

export default config;
