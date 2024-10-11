export const isBusinessDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay(); // getDay() returns 0 for Sunday, 6 for Saturday
  return dayOfWeek !== 0; // 0 is Sunday, so return false if it's Sunday
};

export const calculateBusinessDaysForCurrentMonth = (): number => {
  const today = new Date();

  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month

  let businessDays = 0;

  for (let date = startDate; date <= endDate; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
    if (isBusinessDay(date)) {
      businessDays++;
    }
  }

  return businessDays;
};