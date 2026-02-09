"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import api from "@/lib/api";
import Image from "next/image";

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (score === 2) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-blue-500", width: "75%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ?? "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Full-page background image */}
      <Image
        src="/hotel.jpg"
        alt="Hotel Background"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay to darken background */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-neutral-900">Create account</h2>
        <p className="text-sm text-neutral-700 mt-1 mb-6">
          Sign up to book hotels and enjoy exclusive rewards
        </p>

        {error && (
          <p
            className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {password && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded bg-neutral-200">
                  <div
                    className={`h-full rounded ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Password strength: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-neutral-900 py-2.5 text-white font-medium hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-neutral-700">
            Already a member?{" "}
         <Link
  href="/login"
  className="font-medium underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition"
>
  Sign in
</Link>

          </p>
        </form>
      </div>
    </div>
  );
}