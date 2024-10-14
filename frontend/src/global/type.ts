import ACTION from './action';
import {ROLE} from '../tools/const';

type DefaultFieldUser = string | null;

type User = {
  _id: DefaultFieldUser;
  name: DefaultFieldUser;
  email: DefaultFieldUser;
  favoriteRockGenre: DefaultFieldUser;
  phone: DefaultFieldUser;
  photo: DefaultFieldUser;
  role: (
    typeof ROLE.ADMIN |
    typeof ROLE.STUDENT |
    null
  );
  test: {
    dateStart: Date;
    isTest: boolean;
    questions: {
      question: string;
      isCorrect: boolean;
      studentAnswer: string;
    }[];
  } | null;
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
