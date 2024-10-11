import React, { useContext, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import context from '../../global/context';
import { send } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/const';
import ACTION from '../../global/action';

const SignOut: React.FC = (): null => {
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    closeSection();
  }, []);

  const closeSection = async (): Promise<void> => {
    const { response: { statusCode } } = await send({ api:'sign-out' }).post();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      googleLogout();
      dispatch({ type: ACTION.CLEAN_CACHE });
    }

    navigate('/');
  }

  return null;
}

export default SignOut;
