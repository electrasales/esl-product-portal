"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/app/auth/actions";
import { AuthShell } from "@/components/AuthShell";

const initialState: AuthFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <AuthShell>
      <div className="mt-5 text-center">
        <h1 className="font-head text-2xl font-extrabold text-gray-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Sign in to the Electra Sales product portal
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="block w-full rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50/60 px-3.5 py-3 text-sm text-gray-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50/60 px-3.5 py-3 text-sm text-gray-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15"
          />
        </div>

        {state.error && (
          <p className="text-sm text-brand-red" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-[10px] bg-brand-red py-3 font-head text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-300">
        <div className="h-px flex-1 bg-gray-100" />
        <span>New here?</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="mt-4 text-center">
        <Link href="/signup" className="text-sm font-semibold text-navy-600 hover:text-brand-red">
          Create an account &rarr;
        </Link>
      </div>
    </AuthShell>
  );
}
