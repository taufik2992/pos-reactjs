import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WorkShiftContextType {
  isShiftActive: boolean;
  shiftStartTime: Date | null;
  elapsedTime: number;
  remainingTime: number;
  startShift: () => void;
  endShift: () => void;
  formatTime: (seconds: number) => string;
}

const WorkShiftContext = createContext<WorkShiftContextType | undefined>(undefined);

const SHIFT_DURATION = 8 * 60 * 60; // 8 hours in seconds

export const WorkShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(SHIFT_DURATION);

  // Load shift data from localStorage on mount
  useEffect(() => {
    if (user?.role === 'cashier') {
      const savedShiftData = localStorage.getItem(`shift-${user.id}`);
      if (savedShiftData) {
        try {
          const { startTime, isActive } = JSON.parse(savedShiftData);
          const start = new Date(startTime);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
          
          if (isActive && elapsed < SHIFT_DURATION) {
            setIsShiftActive(true);
            setShiftStartTime(start);
            setElapsedTime(elapsed);
            setRemainingTime(SHIFT_DURATION - elapsed);
          } else if (elapsed >= SHIFT_DURATION) {
            // Shift expired, clean up
            localStorage.removeItem(`shift-${user.id}`);
            toast.error('Your 8-hour shift has ended. Please log in again.');
            logout();
          }
        } catch (error) {
          localStorage.removeItem(`shift-${user.id}`);
        }
      }
    }
  }, [user, logout]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isShiftActive && shiftStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - shiftStartTime.getTime()) / 1000);
        const remaining = SHIFT_DURATION - elapsed;

        setElapsedTime(elapsed);
        setRemainingTime(remaining);

        // Warning notifications
        if (remaining === 30 * 60) { // 30 minutes left
          toast.warning('⏰ 30 minutes remaining in your shift!', { duration: 5000 });
        } else if (remaining === 15 * 60) { // 15 minutes left
          toast.warning('⏰ 15 minutes remaining in your shift!', { duration: 5000 });
        } else if (remaining === 5 * 60) { // 5 minutes left
          toast.warning('⏰ 5 minutes remaining in your shift!', { duration: 5000 });
        } else if (remaining <= 0) {
          // Shift ended
          endShift();
          toast.error('Your 8-hour shift has ended. Logging out...', { duration: 5000 });
          setTimeout(() => {
            logout();
          }, 2000);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isShiftActive, shiftStartTime, logout]);

  const startShift = () => {
    if (user?.role !== 'cashier') return;

    const now = new Date();
    setIsShiftActive(true);
    setShiftStartTime(now);
    setElapsedTime(0);
    setRemainingTime(SHIFT_DURATION);

    // Save to localStorage
    localStorage.setItem(`shift-${user.id}`, JSON.stringify({
      startTime: now.toISOString(),
      isActive: true
    }));

    toast.success('Work shift started! You have 8 hours.', { duration: 3000 });
  };

  const endShift = () => {
    if (user?.role !== 'cashier') return;

    setIsShiftActive(false);
    setShiftStartTime(null);
    setElapsedTime(0);
    setRemainingTime(SHIFT_DURATION);

    // Remove from localStorage
    localStorage.removeItem(`shift-${user.id}`);

    toast.success('Work shift ended successfully!', { duration: 3000 });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <WorkShiftContext.Provider value={{
      isShiftActive,
      shiftStartTime,
      elapsedTime,
      remainingTime,
      startShift,
      endShift,
      formatTime
    }}>
      {children}
    </WorkShiftContext.Provider>
  );
};

export const useWorkShift = () => {
  const context = useContext(WorkShiftContext);
  if (context === undefined) {
    throw new Error('useWorkShift must be used within a WorkShiftProvider');
  }
  return context;
};