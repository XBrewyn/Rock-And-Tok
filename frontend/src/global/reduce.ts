import ACTION from './action';
import initialState from './state';
import { State, User, Option } from './type';

const reducer = (state: State, { payload, type }: Option): State => {
  switch (type) {
    case ACTION.SET_USER:
      return SetUser(state, payload);
    case ACTION.CLEAN_CACHE:
      return cleanCache();
    default:
      return state;
  }
};

const SetUser = (
  state: State, 
  {
    _id = null,
    name = null,
    email = null,
    favoriteRockGenre = null,
    photo = null,
    phone = null,
    role = null,
    test = null,
  }: User): State => ({
  ...state,
  user: { _id, email, name, favoriteRockGenre, photo, phone, role, test }
});

const cleanCache = (): State => ({
  ...initialState
});

export default reducer;
