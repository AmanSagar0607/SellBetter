import React from 'react';

export function ShimmerLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-700 h-6 rounded w-3/4"></div>
      <div className="bg-gray-700 h-6 rounded w-1/2"></div>
      <div className="bg-gray-700 h-6 rounded w-full"></div>
      <div className="bg-gray-700 h-6 rounded w-5/6"></div>
      <div className="bg-gray-700 h-6 rounded w-2/3"></div>
    </div>
  );
}