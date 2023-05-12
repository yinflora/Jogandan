function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function getStartAndEndDate(startDate: Date, endDate: Date) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return { startDate: start, endDate: end };
}

function getThisWeek() {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getStartAndEndDate(sevenDaysAgo, today);
}

function getThisMonth() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return getStartAndEndDate(firstDayOfMonth, lastDayOfMonth);
}

function getLastMonth() {
  const today = new Date();
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return getStartAndEndDate(firstDayOfLastMonth, lastDayOfLastMonth);
}

function getThisYear() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
  return getStartAndEndDate(firstDayOfYear, lastDayOfYear);
}

function getLastYear() {
  const today = new Date();
  const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
  return getStartAndEndDate(firstDayOfLastYear, lastDayOfLastYear);
}

export {
  formatDate,
  getThisWeek,
  getThisMonth,
  getLastMonth,
  getThisYear,
  getLastYear,
};
