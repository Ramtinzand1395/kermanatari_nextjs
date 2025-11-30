"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingProducts() {
  return (
    <div className="overflow-x-auto w-full mt-6 px-4">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        <Skeleton width={180} height={24} />
      </h1>

      <table className="min-w-full border-collapse text-sm bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-blue-500 text-white text-sm">
          <tr>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <th key={i} className="px-4 py-3 text-right">
                  <Skeleton width={80} />
                </th>
              ))}
          </tr>
        </thead>

        <tbody>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <Skeleton width={48} height={48} borderRadius="8px" />
                </td>

                <td className="px-4 py-3">
                  <Skeleton width={120} />
                </td>

                <td className="px-4 py-3 text-center">
                  <Skeleton width={100} />
                </td>

                <td className="px-4 py-3 text-center">
                  <Skeleton width={80} />
                </td>

                <td className="px-4 py-3 text-center">
                  <Skeleton width={40} />
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
