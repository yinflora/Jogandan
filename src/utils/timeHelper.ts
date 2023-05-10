function getThisWeek() {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startDate = `${sevenDaysAgo.getFullYear()}-${String(
    sevenDaysAgo.getMonth() + 1
  ).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const endDate = `${year}-${month}-${day}`;

  return { startDate, endDate };
}

function getThisMonth() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDate = `${firstDayOfMonth.getFullYear()}-${String(
    firstDayOfMonth.getMonth() + 1
  ).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}`;
  const endDate = `${lastDayOfMonth.getFullYear()}-${String(
    lastDayOfMonth.getMonth() + 1
  ).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;

  return { startDate, endDate };
}

function getLastMonth() {
  const today = new Date();
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  const startDate = `${firstDayOfLastMonth.getFullYear()}-${String(
    firstDayOfLastMonth.getMonth() + 1
  ).padStart(2, '0')}-${String(firstDayOfLastMonth.getDate()).padStart(
    2,
    '0'
  )}`;
  const endDate = `${lastDayOfLastMonth.getFullYear()}-${String(
    lastDayOfLastMonth.getMonth() + 1
  ).padStart(2, '0')}-${String(lastDayOfLastMonth.getDate()).padStart(2, '0')}`;
  return { startDate, endDate };
}

function getThisYear() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
  const startDate = `${firstDayOfYear.getFullYear()}-${String(
    firstDayOfYear.getMonth() + 1
  ).padStart(2, '0')}-${String(firstDayOfYear.getDate()).padStart(2, '0')}`;
  const endDate = `${lastDayOfYear.getFullYear()}-${String(
    lastDayOfYear.getMonth() + 1
  ).padStart(2, '0')}-${String(lastDayOfYear.getDate()).padStart(2, '0')}`;
  return { startDate, endDate };
}

function getLastYear() {
  const today = new Date();
  const lastYearStartDate = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearEndDate = new Date(today.getFullYear() - 1, 11, 31);
  const startDate = `${lastYearStartDate.getFullYear()}-${String(
    lastYearStartDate.getMonth() + 1
  ).padStart(2, '0')}-${String(lastYearStartDate.getDate()).padStart(2, '0')}`;
  const endDate = `${lastYearEndDate.getFullYear()}-${String(
    lastYearEndDate.getMonth() + 1
  ).padStart(2, '0')}-${String(lastYearEndDate.getDate()).padStart(2, '0')}`;

  return { startDate, endDate };
}

export { getThisWeek, getThisMonth, getLastMonth, getThisYear, getLastYear };
