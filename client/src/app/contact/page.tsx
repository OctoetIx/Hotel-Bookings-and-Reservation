import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center">
        <Image
          src="/hotel.jpg"
          alt="Hotel"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 text-white">
          <h1 className="text-4xl font-semibold">Contact us</h1>
          <p className="mt-2 text-neutral-200">
            We’d love to hear from you
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Get in touch
              </h2>
              <p className="text-neutral-600 mb-6">
                Have questions about bookings, payments, or rooms?
                Our team is ready to help.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-neutral-600">
                    12 Ocean View Road, Victoria Island, Lagos
                  </p>
                </div>

                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-neutral-600">+234 800 123 4567</p>
                </div>

                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-neutral-600">support@zindumhotels.com</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 h-56 rounded-xl bg-neutral-200 flex items-center justify-center text-sm text-neutral-600">
                Map integration (Google Maps)
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">
                Send us a message
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-neutral-900 outline-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-neutral-900 py-2.5 text-white font-medium hover:bg-neutral-800 transition"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-sm text-neutral-600">
        © {new Date().getFullYear()} Zindum Hotels. All rights reserved.
      </footer>
    </div>
  );
}