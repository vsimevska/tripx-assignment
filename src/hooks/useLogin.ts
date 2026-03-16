import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/src/services/login';

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

export function useLogin() {
  const router = useRouter();
  const failedLoginAttempts = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const isLocked = remainingSeconds > 0;

  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      failedLoginAttempts.current = 0;
    }
  }, [remainingSeconds]);

  async function loginSubmit(username: string, password: string, bookingCode?: string) {
    if (isLocked) return;
    setLoginError(null);
    setIsLoading(true);

    try {
      const data = await login(username, password, bookingCode);
      if (data.bookingCode) {
        localStorage.setItem('bookingCode', data.bookingCode);
      } else {
        localStorage.removeItem('bookingCode');
      }
      router.push('/destinations');
    } catch (error) {
      failedLoginAttempts.current += 1;
      if (failedLoginAttempts.current >= MAX_FAILED_ATTEMPTS) {
        setRemainingSeconds(LOCKOUT_SECONDS);
      }
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return { loginError, loginSubmit, isLoading, isLocked, remainingSeconds };
}
