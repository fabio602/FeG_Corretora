import React from 'react';

const partners = [
    { name: 'Tokio Marine', logo: '/partners/tokio.png' },
    { name: 'Sombrero', logo: '/partners/sombrero.png' },
    { name: 'Pottencial', logo: '/partners/pottencial.png' },
    { name: 'AXA', logo: '/partners/axa.jpg' },
    { name: 'Junto Seguros', logo: '/partners/junto.png' },
];

const InsurersCarousel: React.FC = () => {
    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                {partners.map((partner, index) => (
                    <li key={index}>
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-12 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {partners.map((partner, index) => (
                    <li key={`duplicate-${index}`}>
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-12 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                    </li>
                ))}
            </ul>
            <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default InsurersCarousel;
