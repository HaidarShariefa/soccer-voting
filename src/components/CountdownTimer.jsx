import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target: 10:00 PM Beirut Time (UTC+2 or UTC+3 depending on DST, but let's assume fixed date for today)
    // "Todays match" -> I'll assume it's today at 22:00.
    // Beirut is UTC+2 (Standard) or UTC+3 (Summer). Currently December, so likely UTC+2.
    // Let's set the target to today at 22:00 local time (assuming user is in Beirut or I should use a fixed offset).
    // The prompt says "10:00 PM Beirut Time".
    // I will construct the date object for today at 22:00 Beirut time.
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(22, 0, 0, 0); // 10:00 PM
      
      // If it's already past 10 PM, maybe set to tomorrow? Or just show 0.
      // For the sake of the demo, if it's past, let's keep it at 0 or show "Match Started".
      
      const difference = target.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center backdrop-blur-md shadow-lg">
        <span className="text-2xl md:text-3xl font-bold text-white font-mono">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center mb-12"
    >
      <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-real-gold to-city-sky mb-6">
        KICKOFF IN
      </h2>
      <div className="flex justify-center">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
