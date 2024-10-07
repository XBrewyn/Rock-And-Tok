type Field = {
  avoidEmptyField?: boolean;
  label?: string;
  placeholder: string;
  type: 'text' | 'password' | 'email' | 'textarea' | 'select';
  value?: string;
  validator?: {
    message: string;
    regExp: RegExp;
  }
  options?: string[];
  autocomplete?: 'new-password' | 'off' | 'on'
};

type Fields = {
  [key: string]: Field;
};

type FormField = Field & { errorMessage?: string; };

export type {
  Field,
  Fields,
  FormField
}
