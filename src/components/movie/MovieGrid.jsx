import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.slug} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
