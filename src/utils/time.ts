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

export const getNextMonth = (date: string): string => {
  const [year, month, day] = date.split("-");
  const nextMonthDate = new Date(parseInt(year), parseInt(month), parseInt(day));
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = String(nextMonthDate.getMonth()).padStart(2, "0");
  const nextDay = String(nextMonthDate.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export const formatDate = (date: string): string => {
  const [year, month, day] = date.split("-");
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
};