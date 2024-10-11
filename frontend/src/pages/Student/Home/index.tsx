import React, { useEffect, useRef, useState } from 'react';
import { questions } from './data';
import { Question } from './type';
import style from './style.module.sass';

const Home: React.FC = (): JSX.Element => {
  const [state, setState] = useState<Question[]>(questions);
  const [index, setIndex] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const [input, setInput] = useState('');
  const [canStart, setCanStart] = useState<boolean>(false);

  useEffect(() => {
    setInput(state[index].studentAnswer);
  }, [state[index].studentAnswer]);

  const onClickNextButton = () => {
    if (index < state.length - 1 && input) {
      setIndex((currentIndex) => currentIndex + 1);
      setState((currentState) => {
        const newState = [...currentState];
        const question: string = formatInputValue(newState[index].answer);
        const answer: string = formatInputValue(input);

        newState[index].studentAnswer = formatInputValue(input);
        newState[index].isCorrect = question === answer;

        return newState;
      });

      setInput('');
    }
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

  const resetQuiz = (): void => {
    setState(questions);
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
      }

      if (timerRef.current) {
        timerRef.current.textContent = `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
      }
    }, 10);

    const formatTime = (time: number): string | number =>
      time < 10 ? `0${time}` : time;
  }

  const onStart = () => {
    startTimer();
    setCanStart(true);
  }

  return (
    <section className={style.quiz}>
      <header className={style.quiz__header}>
        <h1>Quiz</h1>
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
    </section>
  );
}

export default Home;
