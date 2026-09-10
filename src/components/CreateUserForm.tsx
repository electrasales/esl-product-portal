"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/admin/users/actions";

const inputClass =
  "mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none";

export function CreateUserForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"customer" | "staff">("customer");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ email: string; password: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await createUser({ fullName, phone, email, role });
    setSaving(false);

    if (res.error || !res.password) {
      setError(res.error ?? "Something went wrong.");
      return;
    }

    setResult({ email, password: res.password });
    setFullName("");
    setPhone("");
    setEmail("");
    setRole("customer");
    router.refresh();
  }

  if (result) {
    return (
      <div className="rounded-[14px] border border-navy-50 bg-navy-50 p-5">
        <p className="font-head text-sm font-bold text-navy-900">Account created</p>
        <p className="mt-1 text-[13px] text-gray-700">
          Share these sign-in details with {result.email} &mdash; they should
          change the password after logging in.
        </p>
        <div className="mt-3 space-y-1 rounded-[9px] bg-white px-4 py-3 text-sm">
          <div>
            <span className="text-gray-400">Email:</span>{" "}
            <span className="font-semibold text-gray-900">{result.email}</span>
          </div>
          <div>
            <span className="text-gray-400">Temporary password:</span>{" "}
            <span className="font-mono font-semibold text-gray-900">{result.password}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-3 text-[13px] font-semibold text-navy-600 hover:text-brand-red"
        >
          + Create another user
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-gray-100 bg-white p-5"
    >
      <p className="font-head text-sm font-bold text-gray-900">Create user</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-gray-700">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">
            Phone <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "customer" | "staff")}
            className={inputClass}
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-[10px] bg-brand-red px-5 py-2.5 font-head text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
      >
        {saving ? "Creating..." : "Create user"}
      </button>
    </form>
  );
}
