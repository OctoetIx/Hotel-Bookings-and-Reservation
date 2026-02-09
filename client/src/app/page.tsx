import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar"

export default function HomePage() {
  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="/hotel.jpg"
          alt="Luxury hotel"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Book luxury hotels <br /> with confidence
            </h1>
            <p className="mt-4 text-neutral-200">
              Discover premium rooms, seamless bookings, and secure payments —
              all in one place.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-white px-6 py-3 text-neutral-900 font-medium text-center hover:bg-neutral-200"
              >
                Get started
              </Link>
              <Link
                href="#rooms"
                className="rounded-lg border border-white px-6 py-3 text-white text-center hover:bg-white/10"
              >
                View rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-semibold mb-10">Popular rooms</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Standard", "Deluxe", "Executive"].map((room) => (
              <div
                key={room}
                className="rounded-xl bg-white shadow-sm border overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src="/hotel.jpg"
                    alt={room}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{room} Room</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Comfortable stay with premium amenities.
                  </p>
                  <button className="mt-4 w-full rounded-lg bg-neutral-900 py-2 text-white hover:bg-neutral-800">
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-semibold mb-10">Why choose us</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Secure payments",
              "Instant confirmation",
              "24/7 support",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-xl border p-6 bg-white"
              >
                <h3 className="font-medium">{feature}</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Enjoy a smooth and reliable booking experience every time.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t bg-neutral-50 py-10 text-center text-sm text-neutral-600"
      >
        © {new Date().getFullYear()} Zindum Hotels. All rights reserved.
      </footer>
    </div>
  );
}