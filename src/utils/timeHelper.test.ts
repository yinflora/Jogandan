import {
  formatDate,
  getLastMonth,
  getLastYear,
  getThisMonth,
  getThisWeek,
  getThisYear,
} from './timeHelper';

describe('TimeHelper function Tests', () => {
  it('should return the start and end date of this week', () => {
    const { startDate, endDate } = getThisWeek();
    const expectedStartDate = new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    );
    const expectedEndDate = new Date();
    expect(startDate).toBe(formatDate(expectedStartDate));
    expect(endDate).toBe(formatDate(expectedEndDate));
  });

  it('should return the start and end date of this month', () => {
    const { startDate, endDate } = getThisMonth();
    const today = new Date();
    const expectedStartDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const expectedEndDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    expect(startDate).toBe(formatDate(expectedStartDate));
    expect(endDate).toBe(formatDate(expectedEndDate));
  });

  it('should return the start and end date of last month', () => {
    const { startDate, endDate } = getLastMonth();
    const today = new Date();
    const expectedStartDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const expectedEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
    expect(startDate).toBe(formatDate(expectedStartDate));
    expect(endDate).toBe(formatDate(expectedEndDate));
  });

  it('should return the start and end date of this year', () => {
    const { startDate, endDate } = getThisYear();
    const today = new Date();
    const expectedStartDate = new Date(today.getFullYear(), 0, 1);
    const expectedEndDate = new Date(today.getFullYear(), 11, 31);
    expect(startDate).toBe(formatDate(expectedStartDate));
    expect(endDate).toBe(formatDate(expectedEndDate));
  });

  it('should return the start and end date of last year', () => {
    const { startDate, endDate } = getLastYear();
    const today = new Date();
    const expectedStartDate = new Date(today.getFullYear() - 1, 0, 1);
    const expectedEndDate = new Date(today.getFullYear() - 1, 11, 31);
    expect(startDate).toBe(formatDate(expectedStartDate));
    expect(endDate).toBe(formatDate(expectedEndDate));
  });
});
