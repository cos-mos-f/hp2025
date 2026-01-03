import { useCallback, useEffect, useRef } from "react";

type SmoothWheelOptions = {
  getMax: () => number;
  getCurrent: () => number;
  setCurrent: (value: number) => void;
  onStep?: (value: number, max: number) => void;
  smoothingMs?: number;
  epsilon?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useSmoothWheel = ({
  getMax,
  getCurrent,
  setCurrent,
  onStep,
  smoothingMs = 120,
  epsilon = 0.5,
}: SmoothWheelOptions) => {
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const currentRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      currentRef.current = null;
    }
  }, []);

  const step = useCallback(
    (time: number) => {
      const max = Math.max(0, getMax());
      const target = clamp(targetRef.current, 0, max);
      const current = currentRef.current ?? getCurrent();

      const lastTime = lastTimeRef.current ?? time;
      const deltaTime = Math.min(time - lastTime, 48);
      lastTimeRef.current = time;

      const smoothing = 1 - Math.exp(-deltaTime / smoothingMs);
      const next = current + (target - current) * smoothing;

      setCurrent(next);
      currentRef.current = next;
      if (onStep) {
        onStep(next, max);
      }

      if (Math.abs(target - next) < epsilon) {
        setCurrent(target);
        currentRef.current = target;
        if (onStep) {
          onStep(target, max);
        }
        rafRef.current = null;
        lastTimeRef.current = null;
        currentRef.current = null;
        return;
      }

      rafRef.current = window.requestAnimationFrame(step);
    },
    [getCurrent, getMax, onStep, setCurrent, smoothingMs],
  );

  const start = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(step);
  }, [step]);

  const addDelta = useCallback(
    (delta: number) => {
      if (rafRef.current === null) {
        const current = getCurrent();
        targetRef.current = current;
        currentRef.current = current;
      }
      const max = Math.max(0, getMax());
      targetRef.current = clamp(targetRef.current + delta, 0, max);
      start();
    },
    [getCurrent, getMax, start],
  );

  const setTarget = useCallback((value: number) => {
    targetRef.current = value;
  }, []);

  useEffect(() => stop, [stop]);

  return {
    addDelta,
    setTarget,
    stop,
  };
};
