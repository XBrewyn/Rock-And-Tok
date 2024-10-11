import { Fields } from '../../components/Form/type';
import { VALIDATOR } from '../../tools/const';

const form: Fields = {
  email: {
    placeholder: 'Email',
    type: 'email',
    validator: VALIDATOR.EMAIL
  },

  password: {
    placeholder: 'Password',
    type: 'password',
    validator: VALIDATOR.PASSWORD
  },
}

const BANNER_URL: string = './images/log-in.jpg';

export {
  form,
  BANNER_URL
}
