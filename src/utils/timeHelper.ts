const formatTime = (time: number) => {
  const date = new Date(time * 1000);
  const options: object = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('zh-TW', options);
};

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

const getStartAndEndDate = (startDate: Date, endDate: Date) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return { startDate: start, endDate: end };
};

const getThisWeek = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getStartAndEndDate(sevenDaysAgo, today);
};

const getThisMonth = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return getStartAndEndDate(firstDayOfMonth, lastDayOfMonth);
};

const getLastMonth = () => {
  const today = new Date();
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return getStartAndEndDate(firstDayOfLastMonth, lastDayOfLastMonth);
};

const getThisYear = () => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
  return getStartAndEndDate(firstDayOfYear, lastDayOfYear);
};

const getLastYear = () => {
  const today = new Date();
  const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
  return getStartAndEndDate(firstDayOfLastYear, lastDayOfLastYear);
};

export {
  formatTime,
  formatDate,
  getThisWeek,
  getThisMonth,
  getLastMonth,
  getThisYear,
  getLastYear,
};
