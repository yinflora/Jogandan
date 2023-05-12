//檢查轉圈圈
// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// import { describe, expect, test } from '@jest/globals';

function add(a, b) {
  if (typeof a === 'string') {
    window.alert('a is a string');
  }
  return a + b;
}

describe('add function', () => {
  it('should add 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  it('should add -2 + -3 to equal -5', () => {
    expect(add(-3, -2)).toBe(-5);
  });
  it('should alert if a is a string', () => {
    const spy = jest.spyOn(window, 'alert'); // 用 jest.spyOn 監測 window.alert 函數
    add('hello', 2); // 呼叫 add 函數，a 為字串 'hello'
    expect(spy).toHaveBeenCalledWith('a is a string'); // 用 expect 驗證 window.alert 是否被呼叫過，且傳入正確的參數
  });
});
