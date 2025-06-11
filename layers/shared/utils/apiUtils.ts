/**
 * Safely execute an API call with automatic error handling.
 *
 * @template T - The expected return type of the API call
 * @param {() => Promise<T>} apiCall - The API call function to execute
 * @param {object} options - Additional options
 * @param {boolean} options.rethrow - Whether to rethrow the error (default: false)
 * @param {(error: any) => void} options.onError - Optional callback to handle errors
 * @returns {Promise<T | null>} - The API response or null if an error occurred
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    rethrow?: boolean;
    onError?: (error: any) => void;
  } = {}
): Promise<T | false> {
  const { rethrow = false, onError } = options;

  try {
    return await apiCall();
  } catch (error) {
    // Error is already handled by the API plugin's onResponseError

    // Optional custom error handling
    if (onError) {
      onError(error);
    }

    // Optionally rethrow for specific flow control needs
    if (rethrow) {
      throw error;
    }

    return false;
  }
}
