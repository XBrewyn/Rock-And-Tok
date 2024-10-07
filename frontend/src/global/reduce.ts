import ACTION from './action';
import { State, User, Option } from './type';

const reducer = (state: State, { payload, type }: Option): State => {
  switch (type) {
    case ACTION.SET_USER:
      return SetUser(state, payload);
    default:
      return state;
  }
};

const SetUser = (
  state: State, 
  {
    _id = null, email = null, name = null, 
    username = null, role = null 
  }: User): State => ({
  ...state,
  user: { _id, email, name, username, role }
});

export default reducer;
