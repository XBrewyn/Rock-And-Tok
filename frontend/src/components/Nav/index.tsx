import React, { useContext, useEffect, useRef, useState } from 'react';
import { studentTabs, homeTabs, AdminTabs } from './data';
import { Link, useLocation } from 'react-router-dom';
import style from './style.module.sass';
import { getClassName, isAdmin, isSignOut, isStudent } from '../../tools/functions';
import Loading from './Loading';
import { Tab } from './type';
import context from '../../global/context';

const Nav: React.FC = (): JSX.Element => {
  const [{ user: { role } }] = useContext(context);
  const [tabs, setTabs] = useState<Tab[]>([])
  const inputRef: React.MutableRefObject<any> = useRef<any>(null);
  const location: any = useLocation();
  const [loading, setLoading] = useState({
    text: '',
    canShow: true,
  });

  useEffect(() => {
    if (isStudent(role)) {
      setTabs(studentTabs);
    }

    if (isSignOut(role)) {
      setTabs(homeTabs);
    }

    if (isAdmin(role)) {
      setTabs(AdminTabs);
    }
  }, [role]);

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
        <Link
          onClick={() => onClick('Home')}
          to="/"
          className={style.nav__logoContainer}
        >
          <img
            alt="logo"
            className={style.nav__logo}
            src="/logo.jpg"
          />
        </Link>

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
            >
              <Link
                className={style.nav__link}
                to={path}
                onClick={() => onClick(label)}
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
