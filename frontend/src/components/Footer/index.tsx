import React from 'react';
import style from './style.module.sass';

const Footer: React.FC = (): JSX.Element => (
  <footer className={style.footer}>
    <span>Copyright © {new Date().getFullYear()} Rock And Tok</span>
  </footer>
);

export default Footer;
