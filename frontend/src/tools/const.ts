const ROLE: { [key: string]: string; } = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
}

const VALIDATOR: { [key: string]: { message: string; regExp: RegExp; }; } = {
  USERNAME: {
    message: 'Por favor, introduzca un nombre de usuario válido.',
    regExp: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
  },
  EMAIL: {
    message: 'Por favor, introduzca una dirección de correo válida.',
    regExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE_NUMBER: {
    message: 'Por favor, introduzca un número de teléfono.',
    regExp: /^\+?\d{1,3}[- ]?\(?\d{1,3}\)?[- ]?\d{3,5}[- ]?\d{4}$/
  },
  NAME: {
    message: 'Por favor, introduzca un nombre válido.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  LAST_NAME: {
    message: 'Por favor, introduzca un apellido válido.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  PASSWORD: {
    message: 'Su contraseña debería tener al menos 8 caracteres.',
    regExp: /^.{8,}$/
  },
};

export {
  ROLE,
  VALIDATOR
}
