import { useState, useEffect, useCallback, useRef } from "react";

export function useSimulationPlayer(totalSteps, defaultSpeedMs = 900) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMs, setSpeed] = useState(defaultSpeedMs);

  const timerRef = useRef(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const isDone = totalSteps > 0 && currentStep >= totalSteps - 1;

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps - 1) return prev;
      return prev + 1;
    });
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= -1) return -1;
      return prev - 1;
    });
  }, []);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(-1);
    }
    setIsPlaying(true);
    setIsPaused(false);
  }, [totalSteps, currentStep]);

  const pause = useCallback(() => {
    stopTimer();
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (isDone) return;
    setIsPlaying(true);
    setIsPaused(false);
  }, [isDone]);

  const reset = useCallback(() => {
    stopTimer();
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused && currentStep < totalSteps - 1) {
      // Small delay on step 0 if starting fresh from -1 to 0 could be beneficial,
      // but standard timeout handles it properly.
      timerRef.current = setTimeout(() => {
        stepForward();
      }, speedMs);
    } else if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
      setIsPaused(false);
    }
    return stopTimer;
  }, [isPlaying, isPaused, currentStep, speedMs, totalSteps, stepForward]);

  // Auto-reset when the total steps change (e.g., input updated)
  useEffect(() => {
    reset();
  }, [totalSteps, reset]);

  return {
    currentStep,
    isPlaying,
    isPaused,
    isDone,
    speedMs,
    play,
    pause,
    resume,
    reset,
    stepForward,
    stepBack,
    setSpeed
  };
}
