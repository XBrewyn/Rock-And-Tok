import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.sass';
import { getClassName } from '../../../tools/functions';
import { State } from './type';

interface Props {
  text?: string;
  canShow?: boolean;
}

const Loading: React.FC<Props> = ({ text, canShow = true }): JSX.Element => {
  const [state, setState] = useState({ text, canShow, animation: '' });

  useEffect(() => {
    if (text === '') {
      showCounter();
    } else {
      showSection();
    }
  }, [text]);

  const showSection = () => {
    setNewState({ canShow: true, text });
    setTimeout(() => setNewState({ canShow: false, text: '', animation: getAnimation() }), 1000);
  }

  const showCounter = (): void => {
    let count: number = 0;

    const interval: NodeJS.Timeout = setInterval(() => {
      count++;

      if (count <= 100) {
        setNewState({ text: `${count}%` });
      }

      if (count === 150) {
        clearInterval(interval);
        setNewState({ canShow: false, text: '', animation: getAnimation() });
      }
    }, 20);
  }

  const setNewState = ({ text, canShow, animation }: State) => {
    const isUndefined = (type: any) => type === undefined;

    setState((currentState: any) => ({
      ...currentState,
      text: text || currentState.text,
      canShow: isUndefined(canShow) ? currentState.canShow : canShow,
      animation: isUndefined(animation) ? currentState.animation : animation
    }));
  }

  const getAnimation = (): string => {
    const classNameAnimation: string[] = [
      style.loading__bottom,
      style.loading__top,
      style.loading__left,
      style.loading__right
    ];

    return classNameAnimation[Math.floor(Math.random() * classNameAnimation.length)];
  }

  return (
    <>
      <div className={
        getClassName(
          style.loading,
          !state.canShow ? state.animation : ''
        )
      }>
        <h2>{state.text}</h2>
      </div>
    </>
  );
};

export default Loading;
