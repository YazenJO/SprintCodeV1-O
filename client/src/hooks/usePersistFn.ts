import { useRef } from "react";

export function usePersistFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T | undefined>(undefined);
  if (!persistFn.current) {
    persistFn.current = function (this: any, ...args) {
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}
