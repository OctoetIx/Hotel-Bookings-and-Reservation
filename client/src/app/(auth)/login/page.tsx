"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/login", {
        email,
        password,
      });

      // Backend sets HTTP-only cookie
      router.push("/");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ??
          "Incorrect details. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      {/* Background image */}
      <Image
        src="/hotel.jpg"
        alt="Hotel background"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Right-aligned form container */}
      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 lg:px-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur"
        >
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 mb-6 text-sm text-neutral-600">
            Sign in to manage your bookings
          </p>

          {error && (
            <p
              className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="space-y-4">
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
              />
            </div>
          </div>
          <label className="mt-4 inline-flex items-center text-sm ">
            <input type="checkbox" name="Remember me" value="true"/> 
            Remember me?
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-neutral-900 py-2.5 text-white font-medium hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Don’t have an account?{" "}
            <Link href="/register" className="font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}