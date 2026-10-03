import { TODAY } from './data';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const fmt = {
  day: (d: Date) => d.getDate(),
  mon: (d: Date) => MONTHS[d.getMonth()],
  monLong: (d: Date) => MONTHS_LONG[d.getMonth()],
  dow: (d: Date) => DAYS[d.getDay()],
  dowLong: (d: Date) => DAYS_LONG[d.getDay()],
  long: (d: Date) => `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`,
  short: (d: Date) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`,
  relative: (d: Date) => {
    const diff = Math.round((d.getTime() - TODAY.getTime()) / 86400000);
    if (diff === 0) return 'Tonight';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff < 0) return `${-diff} days ago`;
    if (diff < 7) return DAYS_LONG[d.getDay()];
    return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  },
  rand: (n: number) => `R${n}`,
  key: (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
};
