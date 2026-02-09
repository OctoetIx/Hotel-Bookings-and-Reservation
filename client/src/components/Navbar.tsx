"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold">
            Zindum<span className="text-neutral-500">Hotels</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="rooms" className="hover:text-neutral-600">
              Rooms
            </Link>
            <Link href="features" className="hover:text-neutral-600">
              Features
            </Link>
            <Link href="contact" className="hover:text-neutral-600">
              Contact
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
            >
              Sign in
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg border px-3 py-2 text-sm"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="#rooms" onClick={() => setOpen(false)}>
                Rooms
              </Link>
              <Link href="#features" onClick={() => setOpen(false)}>
                Features
              </Link>
              <Link href="#contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-center text-white"
              >
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}