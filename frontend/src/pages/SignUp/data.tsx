import { Fields } from '../../components/Form/type';
import { VALIDATOR } from '../../tools/const';

const form: Fields = {
  name: {
    placeholder: 'Name',
    type: 'text',
    validator: VALIDATOR.USERNAME
  },
  
  lastName: {
    placeholder: 'Last name',
    type: 'text',
    validator: VALIDATOR.LAST_NAME
  },

  favoriteRockGenre: {
    placeholder: 'Favorite rock genre',
    type: 'select',
    options: [
      'Rock Clásico',
      'Hard Rock',
      'Punk Rock',
      'Heavy Meal',
      'Death Metal',
      'New Metal',
      'Grunge',
      'Rock Alternativo',
      'Rock Progresivo',
      'Indie Rock',
      'Glam Rock',
      'Southern Rock'
    ]
  },

  email: {
    placeholder: 'Email',
    type: 'email',
    validator: VALIDATOR.EMAIL
  },

  phone: {
    placeholder: 'Phone (opcional)',
    type: 'text',
    validator: VALIDATOR.PHONE_NUMBER,
    avoidEmptyField: true,
  },

  password: {
    placeholder: 'Password',
    type: 'password',
    validator: VALIDATOR.PASSWORD,
    autocomplete: 'new-password'
  },
}

const BANNER_URL: string = 'https://images.pexels.com/photos/14436042/pexels-photo-14436042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

export {
  form,
  BANNER_URL
}
