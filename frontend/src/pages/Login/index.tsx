import React, { useContext } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import { form, BANNER_URL } from './data';
import style from './style.module.sass';
import context from '../../global/context';
import ACTION from '../../global/action';

const Login: React.FC = (): JSX.Element => {
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  const onData = (data: any): void => {
    dispatch({ type: ACTION.SET_USER, payload: data });
    navigate('/');
  }

  return (
    <section className={style.signIn}>
      <Form
        api="login"
        bannerURL={BANNER_URL}
        buttonText="Sign in"
        fields={form}
        google="signin_with"
        onData={onData}
        title="Log in"
      />
    </section>
  );
}

export default Login;
