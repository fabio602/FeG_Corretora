
import React from 'react';
import { STATS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-fg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fg-gold/5 rounded-full -mr-32 -mt-32"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 text-fg-gold opacity-50 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-fg-gold font-medium uppercase tracking-widest text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
