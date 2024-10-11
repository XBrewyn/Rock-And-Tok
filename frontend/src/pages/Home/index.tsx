import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.sass';

const Home: React.FC = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [audio, setAudio] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (playInterval) clearInterval(playInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      document.body.style.cssText = 'opacity: 1; background: black;';
    };
  }, [playInterval]);

  const getRandomColor = (): string => {
    const colors = [
      "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5",
      "#FF9F33", "#9F33FF", "#33FF9F", "#F5FF33", "#5733FF"
    ];
    return colors[random(colors.length)];
  };

  const random = (length: number): number =>
    Math.floor(Math.random() * length);

  const handleClickPlay = (): void => {
      const audio: HTMLAudioElement = new Audio('/home.mp3');
      const body: HTMLElement = document.body;
      let canStopTransition: boolean = false;

      if (playButtonRef.current) {
        playButtonRef.current.style.display = 'none';
      }

      if (videoRef.current) {
        videoRef.current.play();
      }

      audio.play();
      setAudio(audio);

      setPlayInterval(setInterval(() => {
        if (audio.currentTime > 5.4) {
          body.style.opacity = '0';
          body.style.transition = 'opacity 1s ease';

          timeoutRef.current = setTimeout(() => {
            body.style.opacity = '1';
            body.style.background = `linear-gradient(90deg, ${getRandomColor()} 0%, ${getRandomColor()} ${random(100) + 50}%)`;

            if (backgroundRef.current) {
              backgroundRef.current.style.display = 'none';
            }
          }, 1000);
        }

        if (canStopTransition) {
          if (playInterval) {
            clearInterval(playInterval);
          }

          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
          }

          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }

          if (backgroundRef.current) {
            backgroundRef.current.style.display = 'block';
          }

          if (playButtonRef.current) {
            playButtonRef.current.style.display = 'block';
          }

          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
    
          body.style.cssText = 'opacity: 1; background: black';
        }
      }, 3000));

      audio.onended = () => {
        canStopTransition = true;
      }
  };

  return (
    <section className={style.home}>
      <div>
        <video className={style.home__video} ref={videoRef} loop>
          <source src='/home.mp4' />
        </video>
        <div
          ref={playButtonRef}
          onClick={handleClickPlay}
          style={{ cursor: 'pointer' }}
        >
          <svg
            stroke="currentColor"
            fill="#9c27b0b3"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="100px"
            width="100px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"></path>
          </svg>
        </div>
        <div ref={backgroundRef} className={style.home__background} />
      </div>
    </section>
  );
};

export default Home;
