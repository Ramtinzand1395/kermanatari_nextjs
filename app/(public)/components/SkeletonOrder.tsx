// components/SkeletonOrder.tsx
export default function SkeletonOrder() {
  return (
    <div className="border p-4 rounded-md shadow animate-pulse mb-4">
      <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="flex space-x-2 mt-2">
        <div className="h-16 w-16 bg-gray-300 rounded"></div>
        <div className="h-16 w-16 bg-gray-300 rounded"></div>
        <div className="h-16 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
