import * as fns from "date-fns";

export const isBusinessDay = (date: Date): boolean => {
  return !fns.isSunday(date);
};

export const calculateBusinessDaysForCurrentMonth = (): number => {
  const today = new Date();
  const startDate = fns.startOfMonth(today);
  const endDate = fns.endOfMonth(today);

  let businessDays = 0;
  const totalDays = fns.differenceInCalendarDays(endDate, startDate);

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = fns.addDays(startDate, i);
    if (isBusinessDay(currentDate)) {
      businessDays++;
    }
  }

  return businessDays;
};