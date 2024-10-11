import React, { useState, useMemo } from 'react';
import { Fields, FormField } from './type';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import style from './style.module.sass';
import { ObjectValueString } from '../../tools/type';
import { send } from '../../tools/functions';
import Loading from './Loading';
import { HTTP_STATUS_CODES } from '../../tools/const';

interface Props {
  avoidEmptyField?: boolean;
  buttonText: string;
  fields: Fields;
  google?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  onData?: (data: any) => void;
  title?: string;
  bannerURL?: string;
  api: string;
}

interface State {
  [key: string]: FormField
}

const Form: React.FC<Props> = ({
  buttonText,
  fields,
  google,
  onData = () => { },
  title,
  bannerURL,
  api
}): JSX.Element => {
  const [state, setState] = useState<State>(fields);
  const fieldKeys: string[] = useMemo(() => Object.keys(state), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = async (event: any): Promise<void> => {
    event && event.preventDefault();
    setIsLoading(true);

    if (isValid()) {
      handleApiResponse({ data: getData(), api });
    }

    setIsLoading(false);
  }

  const handleApiResponse = async ({ data, api }: { data: any, api: string;}) => {
    const { response: { data: dataResponse, statusCode } } = await send({ api, data }).post();
    const isBadRequest: boolean = statusCode === HTTP_STATUS_CODES.BAD_REQUEST;
    const isSuccessfully: boolean = statusCode === HTTP_STATUS_CODES.OK;

    if (isSuccessfully) {
      onData(dataResponse);
    }

    if (isBadRequest) {
      Object.keys(dataResponse).forEach((key: string): void => {
        const field: FormField = state[key];

        if (field) {
          field.errorMessage = dataResponse[key] || '';
          setField(key, field);
        }
      });
    }
  }

  const getData = (): ObjectValueString => {
    const data: ObjectValueString = {};

    Object.keys(state).forEach((key: string) => {
      data[key] = state[key].value || '';
    });

    return data;
  }

  const onKeyDown = ({ key }: any): void => {
    key === 'Enter' && onClick(null);
  }

  const onChange = ({ target: { value = '', name: key } }: any): void =>
    setField(key, { ...state[key], value });

  const isValid = (): boolean => {
    let isValid: boolean = true;

    fieldKeys.forEach((fieldKey: string): void => {
      const field: FormField = state[fieldKey];
      const value: string = field.value || '';
      const isEmpty: boolean = !value;
      const isErrorMessage: boolean = !!field.validator && !field.validator.regExp.test(value);

      if (isEmpty && !field.avoidEmptyField) {
        field.errorMessage = 'Please fill out this required field.';
      } else if (isErrorMessage && !field.avoidEmptyField || value && isErrorMessage) {
        field.errorMessage = field.validator?.message;
      } else {
        field.errorMessage = '';
      }

      if (isValid) {
        isValid = !(isEmpty || isErrorMessage);
      }

      setField(fieldKey, field);
    });

    return isValid;
  }

  const setField = (key: string, value: FormField): void =>
    setState((currentState: State): State => ({ ...currentState, [key]: value }));

  return (
    <div className={style.form}>
      {bannerURL && (
        <div className={style.form__banner}>
          <img src={bannerURL} alt="banner" />
        </div>
      )}

      <form className={style.form__container}>
        {title && (
          <header className={style.form__header}>
            <h1>{title}</h1>
          </header>
        )}

        {fieldKeys.map((key: string, index: number) => {
          const {
            placeholder, value = '', type,
            label, errorMessage = '', options = [],
            autocomplete = ''
          } = state[key];

          return (
            <div key={index}>
              {label && <label className={style.form__label}>{label}</label>}
              {type !== 'select' && (
                <input
                  name={key}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  type={type}
                  value={value}
                  autoComplete={autocomplete}
                />
              )}

              {!!(type === 'select' && options.length) && (
                <select
                  name={key}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  value={value}
                >
                  <option value="" disabled>
                    {placeholder}
                  </option>
                  {options.map((option: string, index: number) =>
                    <option key={index} value={option} className={style.form__option}>
                      {option}
                    </option>
                  )}
                </select>
              )}

              {errorMessage && <span className={style.form__error}>{errorMessage}</span>}
            </div>
          )
        })}

        {isLoading ? (
          <Loading />
        ) : (
          <input
            onClick={onClick}
            type="submit"
            value={buttonText}
            className={style.form__submit}
          />
        )}

        <GoogleOAuthProvider clientId={process.env.GOOGLE_ID_CLIENT || ''}>
          {google &&
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const token: string = credentialResponse.credential || '';

                handleApiResponse({ api: `${api}-google`, data: { token } });
              }}

              onError={() => {
                console.log('Login Failed');
              }}
              text={google}
              width="200"
            />
          }
        </GoogleOAuthProvider>
      </form>
    </div>
  );
}

export default Form;
