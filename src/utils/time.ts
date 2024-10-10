import { isSunday, differenceInCalendarDays, addDays, startOfMonth, endOfMonth } from "date-fns";

export const isBusinessDay = (date: Date): boolean => {
  return !isSunday(date);
};

export const calculateBusinessDaysForCurrentMonth = (): number => {
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);

  let businessDays = 0;
  const totalDays = differenceInCalendarDays(endDate, startDate);

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = addDays(startDate, i);
    if (isBusinessDay(currentDate)) {
      businessDays++;
    }
  }

  return businessDays;
};