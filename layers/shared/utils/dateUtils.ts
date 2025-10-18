/**
 * Formats a date to a localized string representation or returns a fallback value if the date is null/undefined
 * @param date Date object, date string, or null/undefined
 * @param fallback String to return if date is null/undefined (default: '-')
 * @param options Intl.DateTimeFormatOptions for formatting (default: localized date format)
 * @returns Formatted date string or fallback value
 */
export function formatDate(
  date: Date | string | null | undefined,
  fallback = '-',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) {
    return fallback;
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return fallback;
    }

    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Calculates the difference between two dates in hours and minutes
 * @param start Start date string
 * @param end End date string
 * @returns String representing the difference in hours and minutes
 */
export const getDiffTime = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};
