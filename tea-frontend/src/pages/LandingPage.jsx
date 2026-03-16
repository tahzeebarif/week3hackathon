import React from 'react';
import { Link } from 'react-router-dom';

const HERO_IMG = '/assets/images/hero.png';

const COLLECTIONS = [
  { name: 'Black Tea',  img: '/assets/images/collections/black-tea.png'  },
  { name: 'Green Tea',  img: '/assets/images/collections/green-tea.png'  },
  { name: 'White Tea',  img: '/assets/images/collections/white-tea.png'  },
  { name: 'Matcha',     img: '/assets/images/collections/matcha.png'     },
  { name: 'Herbal Tea', img: '/assets/images/collections/herbal-tea.png' },
  { name: 'Chai',       img: '/assets/images/collections/chai.png'       },
  { name: 'Oolong',     img: '/assets/images/collections/oolong.png'     },
  { name: 'Rooibos',   img: '/assets/images/collections/rooibos.png'    },
  { name: 'Taiwanese',  img: '/assets/images/collections/taiwanese.png'  },
];

const FEATURES = [
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg>), text: '450+ Kind of Loosef Tea' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>), text: 'Certificated Organic Teas' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), text: 'Free Delivery' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>), text: 'Sample for All Teas' },
];

export default function LandingPage() {
  return (
    <div className="bg-[#f5f5f3]">

      {/* ── Hero ── */}
      <section className="max-w-[1100px] mx-auto px-6 py-16 grid grid-cols-2 gap-14 items-center">
  <div className="overflow-hidden bg-[#eeede9]">
    <img
      src={HERO_IMG}
      alt="Loose leaf tea on spoons"
      className="w-full h-[440px] object-cover block"
    />
  </div>
        <div>
         
         <h1 className="font-prosto text-[46px] leading-[1.2] font-bold text-gray-800 mb-6">
  Every day is unique,<br />just like our tea
</h1>
          <p className="text-sm font-Montserrat text-[#4a4a4a] leading-relaxed mb-3">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam dolor id
            adipiscing odio. Neque lacus nibh eros in.
          </p>
          <p className="text-sm font-Montserrat text-[#4a4a4a] leading-relaxed mb-9">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>
          <Link to="/collections">
            <button className="btn-dark">Browes Teas</button>
          </Link>
        </div>
      </section>

      {/* ── Features Bar ── */}
   {/* ── Features Bar ── */}
      <section className="border-t border-b border-[#e0ddd8] bg-[#eeede9]">
        <div className="max-w-[1100px] mx-auto px-6 py-5 grid grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[#4a4a4a] flex-shrink-0">{f.icon}</span>
              <span className="text-[10px] tracking-[1.5px] uppercase font-sans text-[#1a1a1a]">{f.text}</span>
            </div>
          ))}
        </div>
        {/* ── Learn More ── */}
        <div className="flex justify-center py-5">
          <button className="btn-outline">Learn More</button>
        </div>
      </section>

      {/* ── Collections Grid ── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-20">
        <h2 className="font-serif text-[34px] font-bold text-center text-[#1a1a1a] mb-9">
          Our Collections
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {COLLECTIONS.map((c) => (
            <Link key={c.name} to={`/collections?category=${c.name}`} className="block group">
              <div className="overflow-hidden bg-[#eeede9] aspect-square">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[9px] tracking-[2.5px] uppercase font-sans text-[#1a1a1a] text-center mt-2">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
