import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadline }) => {
  const calculateTimeLeft = () => {
    // בדיקה אם ה-deadline בכלל קיים
    if (!deadline) return {};

    const difference = +new Date(deadline) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // אם אין דדליין או שהזמן עבר
  if (!deadline || Object.keys(timeLeft).length === 0) {
    return <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Closed</div>;
  }

  return (
    <div style={{ color: '#2f2f2f', fontWeight: 'bold', fontSize: '14px' }}>
      Ends in: {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
    </div>
  );
};

export default CountdownTimer;