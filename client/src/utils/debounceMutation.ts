export function debounceMutation<F extends (...args: unknown[]) => void>(
  func: F,
  delay: number = 500
): (...args: Parameters<F>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>) => {
    clearTimeout(timer); 
    timer = setTimeout(() => func(...args), delay); 
  };
}
