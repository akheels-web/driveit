'use client';

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight, Car, Plane, User } from "lucide-react";
import { useEffect, useState } from "react";

const GOLD = '#b48811';

const cars = [
  // Luxury Sedans
  { src: "/sadan/1.jpg", name: "BMW 520D" },
  { src: "/sadan/2.jpg", name: "Lamborghini Gallardo" },
  { src: "/sadan/3.jpg", name: "Lexus ES 300H" },
  { src: "/sadan/4.jpg", name: "Mercedes S 350" },
  { src: "/sadan/5.jpg", name: "Mercedes S 450" },
  { src: "/sadan/6.jpg", name: "Toyota Camry" },
  { src: "/sadan/7.jpg", name: "Volvo S60 D5" },
  { src: "/sadan/8.jpg", name: "Audi A6" },
  { src: "/sadan/9.jpg", name: "Audi RS5 QUATRO" },

  // Premium SUVs & MPVs
  { src: "/suv/1.jpg", name: "KIA Carnival" },
  { src: "/suv/2.jpg", name: "Mercedes GLS 350D" },
  { src: "/suv/3.jpg", name: "Mini Cooper Countryman" },
  { src: "/suv/4.jpg", name: "Toyota Commuter (Custom)" },
  { src: "/suv/5.jpg", name: "Toyota Crysta MT" },
  { src: "/suv/6.jpg", name: "Toyota Fortuner" },
  { src: "/suv/7.jpg", name: "Toyota Vellfire" },
  { src: "/suv/8.jpg", name: "Volvo XC60" },
  { src: "/suv/9.jpg", name: "Audi Q7 Quatro" },

  // Trending & Special Collection
  { src: "/trending/1.jpg", name: "Mercedes G 350 Wagon" },
  { src: "/trending/2.jpg", name: "Mercedes GLS 400D" },
  { src: "/trending/3.jpg", name: "Mercedes V-Class" },
  { src: "/trending/4.jpg", name: "Range Rover Vogue" },
  { src: "/trending/5.jpg", name: "Volvo S90" },
  { src: "/trending/6.jpg", name: "Volvo XC 90" },
  { src: "/trending/7.jpg", name: "BMW 730 LD" },
  { src: "/trending/8.jpg", name: "BMW i4" },
  { src: "/trending/9.jpg", name: "Mercedes C300 Convertible" },
  { src: "/trending/10.jpg", name: "Mercedes E 220D" },
];

// Map each car name to a tab/category without changing the cars array structure
type Category = 'chauffeur' | 'airport' | 'selfdrive';
const categoryMap: Record<string, Category> = {
  // Luxury Sedans -> chauffeur
  'BMW 520D': 'chauffeur',
  'Lamborghini Gallardo': 'selfdrive',
  'Lexus ES 300H': 'chauffeur',
  'Mercedes S 350': 'chauffeur',
  'Mercedes S 450': 'chauffeur',
  'Toyota Camry': 'chauffeur',
  'Volvo S60 D5': 'chauffeur',
  'Audi A6': 'chauffeur',
  'Audi RS5 QUATRO': 'selfdrive',

  // Premium SUVs & MPVs -> airport (mostly)
  'KIA Carnival': 'airport',
  'Mercedes GLS 350D': 'airport',
  'Mini Cooper Countryman': 'airport',
  'Toyota Commuter (Custom)': 'airport',
  'Toyota Crysta MT': 'airport',
  'Toyota Fortuner': 'airport',
  'Toyota Vellfire': 'airport',
  'Volvo XC60': 'airport',
  'Audi Q7 Quatro': 'airport',

  // Trending & Specials -> selfdrive
  'Mercedes G 350 Wagon': 'selfdrive',
  'Mercedes GLS 400D': 'selfdrive',
  'Mercedes V-Class': 'selfdrive',
  'Range Rover Vogue': 'selfdrive',
  'Volvo S90': 'selfdrive',
  'Volvo XC 90': 'selfdrive',
  'BMW 730 LD': 'selfdrive',
  'BMW i4': 'selfdrive',
  'Mercedes C300 Convertible': 'selfdrive',
  'Mercedes E 220D': 'selfdrive',
};

export default function CarsPage() {
  const [active, setActive] = useState<Category>('chauffeur');
  const [loading, setLoading] = useState(false);
  const [displayed, setDisplayed] = useState<typeof cars>(cars);

  const labels: Record<Category, string> = {
    chauffeur: 'Chauffeur Driven',
    airport: 'Airport Pickup / Drop',
    selfdrive: 'Self Drive',
  };

  // Deterministic reorder based on tab so different items appear on top
  const reorder = (list: typeof cars, cat: Category) => {
    const offset = cat === 'chauffeur' ? 0 : cat === 'airport' ? Math.floor(list.length / 3) : Math.floor((list.length * 2) / 3);
    const rotated = list.slice(offset).concat(list.slice(0, offset));
    // Create a light interleave to "mix"
    const firstHalf = rotated.filter((_, i) => i % 2 === 0);
    const secondHalf = rotated.filter((_, i) => i % 2 === 1);
    const mixed: typeof cars = [];
    const max = Math.max(firstHalf.length, secondHalf.length);
    for (let i = 0; i < max; i++) {
      if (i < firstHalf.length) mixed.push(firstHalf[i]);
      if (i < secondHalf.length) mixed.push(secondHalf[i]);
    }
    return mixed;
  };

  // Initialize active tab from URL (?service=chauffeur|airport|selfdrive)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get('service');
      if (svc === 'chauffeur' || svc === 'airport' || svc === 'selfdrive') {
        setActive(svc);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    const next = reorder(cars, active);
    const t = setTimeout(() => {
      setDisplayed(next);
      setLoading(false);
    }, 400); // brief loading feel
    return () => clearTimeout(t);
  }, [active]);

  // Reflect active tab in URL without navigation
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('service', active);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, [active]);

  const Tab = ({ id, label, icon, href }: { id: Category; label: string; icon: React.ReactNode; href: string }) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setActive(id);
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('service', id);
          window.history.replaceState({}, '', url.toString());
        } catch {}
      }}
      className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
        active === id ? 'text-black' : 'text-zinc-300'
      }`}
      style={active === id ? { backgroundColor: GOLD } : {}}
      aria-pressed={active === id}
      role="button"
    >
      {icon}
      <span>{label}</span>
    </a>
  );

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        
        {/* Main Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hire Luxury {labels[active]} Cars
          </h1>
        </div>
        {/* Tabs (pill) */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 bg-zinc-800/80 rounded-full p-1 w-full max-w-3xl">
            <Tab id="chauffeur" href="/services/luxury-car-rental" label="Chauffeur Driven" icon={<User className="w-4 h-4" />} />
            <Tab id="airport" href="/services/airport-taxi" label="Airport Pickup / Drop" icon={<Plane className="w-4 h-4" />} />
            <Tab id="selfdrive" href="/services/luxury-car-rental" label="Self Drive" icon={<Car className="w-4 h-4" />} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)
            : displayed.map((car, i) => (
                <div key={`${car.name}-${i}`} style={{ transitionDelay: `${(i % 9) * 40}ms` }} className="opacity-0 animate-[fadeIn_400ms_ease_forwards]">
                  <CarSimpleCard car={car} active={active} />
                </div>
              ))}
        </div>

        {/* Local animation keyframes */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-\[fadeIn_400ms_ease_forwards\] {
            animation: fadeIn 400ms ease forwards;
          }
        `}</style>

        {/* Note */}
        <div className="mt-10">
          <p className="text-xs md:text-sm text-zinc-400 border-t border-white/10 pt-4">
            <strong>Note:</strong> Detour, stops and extensions not permitted. All Journeys To/From City centres only. For any distant locations, book under “Standard” Package with additional Kms/Hrs
          </p>
        </div>

      </div>
    </section>
  )
}

// Simple Car Card for (src, name) data
function CarSimpleCard({ car, active }: { car: { src: string; name: string }; active: Category }) {
  const brand = car.name.split(' ')[0];
  const serviceHref = active === 'airport' ? '/services/airport-taxi' : '/services/luxury-car-rental';
  const serviceLabel = active === 'airport' ? 'Airport Pickup / Drop' : active === 'selfdrive' ? 'Self Drive' : 'Chauffeur Driven';
  const serviceUrlWithParams = `${serviceHref}?ref=cars&service=${encodeURIComponent(active)}`;
  const waText = `Hi, I would like to book ${car.name} in Hyderabad.\nService: ${serviceLabel}\nURL: ${serviceHref}`;
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
      {/* Header: brand badge, name and price */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-300">
            {brand.slice(0,1)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-200 leading-tight">{car.name}</p>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="relative w-full h-40 md:h-44 lg:h-48">
        <Image src={car.src} alt={`${car.name} luxury car rental Hyderabad`} fill loading="lazy" className="object-contain" />
      </div>
      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={`https://wa.me/918341341186?text=${encodeURIComponent(waText)}`}
          target="_blank"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
          style={{ backgroundColor: GOLD }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={serviceUrlWithParams}
          onClick={(e) => e.preventDefault()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-zinc-200 hover:border-gold hover:text-gold transition text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          Contact
        </a>
      </div>
    </div>
  );
}

// Skeleton placeholder while switching tabs
function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 animate-pulse">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-zinc-800" />
        <div className="flex-1">
          <div className="h-3 w-32 bg-zinc-800 rounded mb-2" />
          <div className="h-2 w-20 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="w-full h-40 md:h-44 lg:h-48 bg-zinc-800 rounded" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 bg-zinc-800 rounded-lg flex-1" />
        <div className="h-9 bg-zinc-800 rounded-lg flex-1" />
      </div>
    </div>
  );
}