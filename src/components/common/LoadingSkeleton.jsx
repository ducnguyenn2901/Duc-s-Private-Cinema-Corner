import React from 'react';

const MovieCardSkeleton = () => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
    </div>
  </div>
);

const MovieGridSkeleton = ({ count = 10 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

export { MovieCardSkeleton, MovieGridSkeleton };
