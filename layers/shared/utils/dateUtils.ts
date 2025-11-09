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

/**
 * Converts an ISO date string to datetime-local format (YYYY-MM-DDTHH:mm:ss)
 * Required for HTML input type="datetime-local" with step="1"
 * @param isoString ISO date string (e.g., "2024-10-25T14:30:45.000Z")
 * @returns Formatted string for datetime-local input (e.g., "2024-10-25T14:30:45") or empty string if invalid
 */
export function formatDateForInput(isoString: string | null): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    // toISOString gives us YYYY-MM-DDTHH:mm:ss.sssZ
    // We need YYYY-MM-DDTHH:mm:ss (first 19 characters with seconds, without milliseconds)
    return date.toISOString().slice(0, 19);
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Converts datetime-local format back to ISO string
 * Preserves the exact time without timezone conversion (same as time tracker)
 * @param dateTimeLocal datetime-local format string (e.g., "2024-10-25T14:30:45")
 * @returns ISO date string (e.g., "2024-10-25T14:30:45.000Z") or empty string if invalid
 */
export function formatDateForSubmit(dateTimeLocal: string): string {
  if (!dateTimeLocal) return '';

  try {
    // datetime-local format: YYYY-MM-DDTHH:mm:ss
    // Just append .000Z to keep the exact time (same as new Date().toISOString() in time tracker)
    return `${dateTimeLocal}.000Z`;
  } catch (error) {
    console.error('Error formatting date for submit:', error);
    return dateTimeLocal;
  }
}
