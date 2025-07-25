import React, { createContext, useContext, useState } from 'react';

interface DateContextType {
  checkInDate: string | null;
  checkOutDate: string | null;
  setDates: (checkIn: string, checkOut: string) => void;
}

const DateContext = createContext<DateContextType>({
  checkInDate: null,
  checkOutDate: null,
  setDates: () => {},
});

export const useDateContext = () => useContext(DateContext);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);

  const setDates = (checkIn: string, checkOut: string) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
  };

  return (
    <DateContext.Provider value={{ checkInDate, checkOutDate, setDates }}>
      {children}
    </DateContext.Provider>
  );
};