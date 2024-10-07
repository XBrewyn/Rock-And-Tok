import React, { useRef, useState } from 'react';
import { tabs } from './data';
import { Link, useLocation } from 'react-router-dom';
import style from './style.module.sass';
import { getClassName } from '../../tools/functions';
import Loading from './Loading';

const Nav: React.FC = (): JSX.Element => {
  const inputRef: React.MutableRefObject<any> = useRef<any>(null);
  const location: any = useLocation();
  const [loading, setLoading] = useState({
    text: '',
    canShow: true,
  });

  const getTabClassName = (path: string): string => {
    const isFirstTab: boolean = path === location.pathname;
    const classNameSelected: string = isFirstTab ? style.nav__selected : '';

    return getClassName(style.nav__tab, classNameSelected);
  }

  const onClick = (text: string) => {
    setLoading({ canShow: true, text });

    inputRef.current.checked = false;
  }

  return (
    <>
      <nav className={style.nav}>
        <div className={style.nav__title}>
          <Link to="/">Rock And Tok</Link>
        </div>

        <input
          className={style.nav__menuInput}
          id="menu-toggle"
          ref={inputRef}
          type="checkbox"
        />

        <label htmlFor="menu-toggle" className={style.nav__menu}>
          <div></div>
          <div></div>
          <div></div>
        </label>

        <ul className={style.nav__tabs}>
          {tabs.map(({ path, label }, index: number): JSX.Element => (
            <li
              className={getTabClassName(path)}
              key={index}
              onClick={() => onClick(label)}
            >
              <Link
                className={style.nav__link}
                to={path}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Loading
        text={loading.text}
        canShow={loading.canShow}
      />
    </>
  );
}

export default Nav;
