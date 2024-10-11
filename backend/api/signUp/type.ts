type Field = {
  key: string;
  value: string;
  validator: {
    message: string;
    regExp: RegExp;
  }
}

export type {
  Field
};
