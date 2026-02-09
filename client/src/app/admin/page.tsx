import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Bookings</p>
            <h2 className="text-2xl font-bold">128</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Revenue</p>
            <h2 className="text-2xl font-bold">₦4,200,000</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Rooms Available</p>
            <h2 className="text-2xl font-bold">12</h2>
          </div>
        </div>
      </div>
    </div>
  );
}