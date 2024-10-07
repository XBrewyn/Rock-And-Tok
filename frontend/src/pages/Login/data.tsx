import { Fields } from '../../components/Form/type';
import { VALIDATOR } from '../../tools/const';

const form: Fields = {
  username: {
    placeholder: 'Email or name',
    type: 'text',
    validator: VALIDATOR.USERNAME
  },

  password: {
    placeholder: 'Password',
    type: 'password',
    validator: VALIDATOR.PASSWORD
  },
}

const BANNER_URL: string = 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

export {
  form,
  BANNER_URL
}
