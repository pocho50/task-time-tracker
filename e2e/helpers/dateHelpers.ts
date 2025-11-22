/**
 * Formats a Date object to datetime-local input format (YYYY-MM-DDTHH:mm:ss)
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Creates a date in the past by subtracting hours
 * @param hoursAgo - Number of hours to subtract
 * @returns Date object in the past
 */
export function getDateHoursAgo(hoursAgo: number): Date {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
}

/**
 * Creates a date in the past by subtracting minutes
 * @param minutesAgo - Number of minutes to subtract
 * @returns Date object in the past
 */
export function getDateMinutesAgo(minutesAgo: number): Date {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}
