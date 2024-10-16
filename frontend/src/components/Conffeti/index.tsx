import React, { useEffect, useRef } from 'react';
import style from './style.module.sass';

const Confetti: React.FC = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const createConfetti = (): void => {
      if (containerRef.current) {
        const confetti = document.createElement('div');
        confetti.classList.add(style.confetti__container);

        // Random size and position
        const size = 10 + 'px';
        const left = Math.random() * 100 + 'vw';
        const delay = Math.random() * 5 + 's';
        const duration = Math.random() * 2 + 2 + 's';

        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.left = left;
        confetti.style.animationDelay = delay;
        confetti.style.animationDuration = duration;
        confetti.style.backgroundColor = getRandomColor();

        // @ts-ignore
        containerRef.current.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    };

    const getRandomColor = (): string => {
      const colors = ['#ff0', '#0f0', '#00f', '#f00', '#f0f', '#0ff'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const interval = setInterval(createConfetti, 50);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return <div className={style.confetti} ref={containerRef}></div>; // Attach ref to the div
};

export default Confetti;
