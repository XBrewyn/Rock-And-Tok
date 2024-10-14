import React, { useContext, useEffect, useRef, useState } from 'react';
import { questions as data } from './data';
import { Question } from './type';
import style from './style.module.sass';
import { send } from '../../../tools/functions';
import context from '../../../global/context';

const Home: React.FC = (): JSX.Element => {
  const [{ user }] = useContext(context);
  const [state, setState] = useState<Question[]>(data);
  const [index, setIndex] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const [input, setInput] = useState<string>('');
  const [canStart, setCanStart] = useState<boolean>(false);
  const [canShowResult, setCanShowResult] = useState<boolean>(false);
  const { test: { isTest = true, questions = [] } } = user;

  useEffect(() => {
    const len: number = state.length - 1;

    if (index < state.length) {
      setInput(state[index].studentAnswer);
    }

    if (canShowResult) {
      saveTest();
    }
  }, [index, state]);

  const onClickNextButton = () => {
    const len: number = state.length - 1;
  
    if (input) {
      updateState();
      
      if (index === len) {
        setCanShowResult(true);
      }
    }
  };

  const updateState = () => {
    setState((currentState) => {
      const newState = [...currentState];
      const questions: string[] = newState[index].answers;
      const answer: string = formatInputValue(input);
  
      newState[index].studentAnswer = input;
      newState[index].isCorrect = questions.some(
        (question: string) => formatInputValue(question) === answer
      );
  
      return newState;
    });
  
    setInput('');
  
    if (index < state.length - 1) {
      setIndex((currentIndex) => currentIndex + 1);
    }
  };

  const saveTest = async () => {
    await send({
      api: 'student-test',
      data: {
        questions: state
      }
    }).patch();
  }

  const formatInputValue = (value: string) =>
    value.toLocaleLowerCase().replace(/[^\w ]/g, '');

  const onChange = ({ target: { value } }: any) => {
    setInput(value);
  }

  const onClickPrevtButton = () => {
    if (index > 0) {
      setIndex((currentIndex) => currentIndex - 1);
    }
  }

  const startTimer = () => {
    const MAX_TIME: number = 59;
    let milliseconds: number = MAX_TIME;
    let seconds: number = MAX_TIME;
    let minutes: number = 20;

    const interval = setInterval(() => {
      milliseconds--;

      if (milliseconds === -1) {
        milliseconds = MAX_TIME;
        seconds--;
      }

      if (seconds === -1) {
        seconds = MAX_TIME;
        minutes--;
      }

      if (minutes === -1) {
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        clearInterval(interval);
        setCanShowResult(true);
      }

      if (timerRef.current) {
        timerRef.current.textContent = `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
      }
    }, 10);

    const formatTime = (time: number): string | number =>
      time < 10 ? `0${time}` : time;
  }

  const onStart = (): void => {
    startTimer();
    setCanStart(true);
  }

  const getScore = (): string => {
    const data = (!isTest && questions.length > 0) ? questions : state;

    return `${data.filter(({ isCorrect = false }): boolean => isCorrect).length} / ${data.length}`;
  }

  return (
    <section className={style.quiz}>
      {!canShowResult && isTest ? (
        <>
          <header className={style.quiz__header}>
            <h2>Test your skills</h2>
          </header>
          {canStart ? (
            <div className={style.quiz__container}>
              <div className={style.quiz__button}>
                <button onClick={onClickPrevtButton}>Prev</button>
              </div>
              <div className={style.quiz__question}>
                <span ref={timerRef}>00:00:00</span>
                <p>{state[index].question}</p>
                <textarea
                  className={style.quiz__input}
                  onChange={onChange}
                  placeholder="Your answer"
                  value={input}
                />

                <div className={style.quiz__button}>
                  <button onClick={onClickPrevtButton}>Prev</button>
                  <button onClick={onClickNextButton}>Next</button>
                </div>
              </div>
              <div className={style.quiz__button}>
                <button onClick={onClickNextButton}>Next</button>
              </div>
            </div>
          ) : (
            <div className={style.quiz__button}>
              <button
                className={style.quiz__buttonStart}
                onClick={onStart}
              >
                start
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <header className={style.quiz__headerResult}>
            <h2>Result: </h2>
            <p>{getScore()}</p>
          </header>
        </div>
      )}
    </section>
  );
}

export default Home;
