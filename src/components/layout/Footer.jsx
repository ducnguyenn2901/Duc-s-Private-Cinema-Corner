import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-lg shadow-primary/20">
                <Film className="text-white" size={20} />
              </div>
              <span className="text-white text-2xl font-black tracking-tighter uppercase italic">
                My<span className="text-primary">Film</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm">
              MyFilm - Duc's Private Cinema Corner
            </p>
          </div>
          
          <div className="text-white font-bold text-lg md:text-xl">
            Copyright © 2026 Duc Nguyen
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
