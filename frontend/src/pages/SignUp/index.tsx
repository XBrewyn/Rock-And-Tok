import React, { useContext } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import { form, BANNER_URL } from './data';
import style from './style.module.sass';
import context from '../../global/context';
import ACTION from '../../global/action';

const SignUp: React.FC = (): JSX.Element => {
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  const onData = (data: any): void => {
    dispatch({ type: ACTION.SET_USER, payload: data });
    navigate('/');
  }

  return (
    <section className={style.signUp}>
      <Form
        api="sign-up"
        bannerURL={BANNER_URL}
        buttonText="Sign up"
        fields={form}
        google="signup_with"
        onData={onData}
        title="Registration info"
      />
    </section>
  );
}

export default SignUp;
