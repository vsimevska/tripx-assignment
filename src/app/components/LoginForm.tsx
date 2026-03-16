'use client';

import { LoginFormErrors, LoginFormSchema } from '@/src/lib/schemas/login';
import { useLogin } from '@/src/hooks/useLogin';
import { useState } from 'react';
import z from 'zod';

export default function LoginForm() {
  const { loginError, loginSubmit, isLoading, isLocked, remainingSeconds } = useLogin();
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = LoginFormSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    const bookingCode = (formData.get('bookingCode') as string | null)?.trim() || undefined;

    setFieldErrors({});
    await loginSubmit(result.data.username, result.data.password, bookingCode);
  }

  return (
    <div className="w-full max-w-sm rounded-2xl p-8 m-6 shadow-md border border-[#3cb7b7] bg-white">
      <h1 className="text-2xl font-bold text-[#1a7a7a] mb-6 text-center">Log in</h1>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-base font-medium text-[#2a9494]"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            disabled={isLocked || isLoading}
            className={`rounded-lg border bg-[#f0fafa] px-3 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 disabled:opacity-50 ${fieldErrors.username ? 'border-red-400 focus:ring-red-300' : 'border-[#3cb7b7] focus:ring-[#3cb7b730]'}`}
          />
          {fieldErrors.username && <p className="text-sm text-red-600">{fieldErrors.username[0]}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-base font-medium text-[#2a9494]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            disabled={isLocked || isLoading}
            className={`rounded-lg border bg-[#f0fafa] px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 disabled:opacity-50 ${fieldErrors.password ? 'border-red-400 focus:ring-red-300' : 'border-[#3cb7b7] focus:ring-[#3cb7b730]'}`}
          />
          {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="bookingCode"
            className="text-base font-medium text-[#2a9494]"
          >
            Booking code <span className="text-gray-400 font-normal text-sm">(optional)</span>
          </label>
          <input
            id="bookingCode"
            name="bookingCode"
            type="text"
            placeholder="Enter your booking code"
            disabled={isLocked || isLoading}
            className={'rounded-lg border bg-[#f0fafa] px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 disabled:opacity-50 border-[#3cb7b7] focus:ring-[#3cb7b730]'}
          />
        </div>

        {isLocked && <p className="text-sm text-red-600">Too many failed attempts. Please wait {remainingSeconds} seconds before trying again </p>}
        {!isLocked && loginError && <p className="text-sm text-red-600">{loginError}</p>}
        <button
          type="submit"
          disabled={isLocked || isLoading}
          className="bg-[#3cb7b7] px-4 py-3 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
