import React from 'react';
import Form from '../../components/Form';
import { form, BANNER_URL } from './data';
import style from './style.module.sass';

const SignIn: React.FC = (): JSX.Element => {
  return (
    <section className={style.signIn}>
      <Form
        title="Log in"
        buttonText="Sign in"
        fields={form}
        google="signin_with"
        bannerURL={BANNER_URL}
      />
    </section>
  );
}

export default SignIn;
