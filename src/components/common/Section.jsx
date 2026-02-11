import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Section = ({ title, children, viewMoreLink }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold border-l-4 border-primary pl-4 uppercase tracking-wider">
          {title}
        </h2>
        {viewMoreLink && (
          <Link 
            to={viewMoreLink}
            className="text-zinc-400 hover:text-primary transition-colors flex items-center text-sm font-medium"
          >
            Xem tất cả <ChevronRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
