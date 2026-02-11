export default function RoomSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white shadow animate-pulse space-y-3">
      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded mt-2"></div>
    </div>
  );
}