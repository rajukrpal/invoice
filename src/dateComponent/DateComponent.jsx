


import React, { useState, useEffect } from 'react';

const DateComponent = ({ children }) => {
  const [todayDate, setTodayDate] = useState('');
  const [futureDate, setFutureDate] = useState('');

  useEffect(() => {
    // Function to calculate and set dates
    const calculateDates = () => {
      const today = new Date();
      const formattedToday = formatDate(today);

      const futureDateObj = new Date(today);
      futureDateObj.setDate(futureDateObj.getDate() + 7);
      const formattedFutureDate = formatDate(futureDateObj);

      setTodayDate(formattedToday);
      setFutureDate(formattedFutureDate);
    };

    // Function to format date as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      return `${year}-${month}-${day}`;
    };

    calculateDates();
  }, []);

  return (
    <div>
      {children(todayDate, futureDate)}
    </div>
  );
};

export default DateComponent;
