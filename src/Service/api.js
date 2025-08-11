import data from './data';
export function fetchProductsMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500); // עיכוב מלאכותי של חצי שנייה
  });
}