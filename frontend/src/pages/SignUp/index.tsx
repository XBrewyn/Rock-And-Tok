import React from 'react';
import Form from '../../components/Form';
import { form, BANNER_URL } from './data';
import style from './style.module.sass';

const SignUp: React.FC = (): JSX.Element => {
  return (
    <section className={style.signUp}>
      <Form
        title="Registration info"
        buttonText="Sign up"
        fields={form}
        google="signup_with"
        bannerURL={BANNER_URL}
        onData={(data) => {
          console.log(data)
        }}
      />
    </section>
  );
}

export default SignUp;
