import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 获取两个日期之间的所有日期
export function getDates(startDate: Date, endDate: Date): string[] {
  const dates = [];
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
}
