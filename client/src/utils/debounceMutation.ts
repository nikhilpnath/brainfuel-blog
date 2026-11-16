export function debounceMutation<F extends (...args: unknown[]) => void>(
  func: F,
  delay: number = 500
): ((...args: Parameters<F>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<F>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}
