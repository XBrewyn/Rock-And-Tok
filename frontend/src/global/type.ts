import ACTION from './action';
import {ROLE} from '../tools/const';

type User = {
  _id: string | null;
  email: string | null;
  name: string | null;
  username: string | null;
  role: (
    typeof ROLE.ADMIN |
    typeof ROLE.STUDENT |
    null
  );
}

type State = {
  user: User;
}

type Option = {
  payload: any,
  type: (
    typeof ACTION.SET_USER |
    typeof ACTION.LOG_OUT
  );
}

export type {
  User,
  State,
  Option
}
