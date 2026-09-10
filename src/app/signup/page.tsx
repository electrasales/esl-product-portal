"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthFormState } from "@/app/auth/actions";
import { AuthShell } from "@/components/AuthShell";

const initialState: AuthFormState = { error: null };

const inputClass =
  "block w-full rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50/60 px-3.5 py-3 text-sm text-gray-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <AuthShell>
      <div className="mt-5 text-center">
        <h1 className="font-head text-2xl font-extrabold text-gray-900">Create an account</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Sign up to browse products and request orders.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="full_name" className="text-xs font-semibold text-gray-700">
            Full name
          </label>
          <input id="full_name" name="full_name" type="text" required autoComplete="name" className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-gray-700">
            Phone <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>

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
            className={inputClass}
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
            minLength={6}
            autoComplete="new-password"
            className={inputClass}
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
          {pending ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-300">
        <div className="h-px flex-1 bg-gray-100" />
        <span>Already registered?</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm font-semibold text-navy-600 hover:text-brand-red">
          Sign in instead &rarr;
        </Link>
      </div>
    </AuthShell>
  );
}
