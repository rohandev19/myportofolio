/**
 * Standalone Debounce Utility
 *
 * Framework-agnostic debounce function for non-React contexts.
 *
 * @example
 * ```typescript
 * const debouncedLog = debounce((msg: string) => console.log(msg), 300);
 * debouncedLog('hello'); // only fires after 300ms of inactivity
 * ```
 */

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}
