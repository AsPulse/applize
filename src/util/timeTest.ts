export function timeTest(it: string, times: number, executor: () => void) {
  const start = performance.now();
  for (let i = 0; i < times; i++) {
    executor();
  }
  const time = (performance.now() - start) / times;
  console.log(`${it}: ${time}ms`);
  return time;
}
