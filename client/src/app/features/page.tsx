import Navbar from "@/components/Navbar";
import {
  Wifi,
  Coffee,
  ShieldCheck,
  Car,
  Waves,
  Utensils,
} from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "Free High-Speed Wi-Fi",
    description: "Stay connected anywhere in the hotel.",
  },
  {
    icon: Coffee,
    title: "24/7 Room Service",
    description: "Order food and drinks anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Safe",
    description: "CCTV, security staff, and keycard access.",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Spacious and secure parking space.",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Relax and unwind in our outdoor pool.",
  },
  {
    icon: Utensils,
    title: "Restaurant & Bar",
    description: "Enjoy premium meals and drinks.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-semibold text-center">
            Hotel Features
          </h1>
          <p className="mt-3 text-center text-neutral-600">
            Everything you need for a comfortable stay
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition"
              >
                <feature.icon className="h-8 w-8 text-neutral-900 mb-4" />
                <h3 className="font-semibold text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}