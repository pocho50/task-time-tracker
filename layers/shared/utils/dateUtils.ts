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
