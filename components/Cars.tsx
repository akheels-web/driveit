import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles, Menu, X, Phone } from 'lucide-react';

// Constants
const GOLD = '#D4AF37';

// Horizontal Scroll Component
const HScroll = ({ children }) => (
  <div className="mt-8 flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700">
    {children}
  </div>
);

// Car Item Component
const CarItem = ({ car, category }) => {
  const whatsappMessage = category === 'sedan' 
    ? `Hi%2C%20I%27d%20like%20to%20book%20${car.title}%20sedan%20in%20Hyderabad.`
    : `Hi%2C%20I%27d%20like%20to%20book%20${car.title}%20for%20self%20drive%20in%20Hyderabad.`;
    
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all duration-300 group snap-start min-w-[300px] w-[300px]">
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <Image
          src={car.img}
          alt={car.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
          <span className="text-xs font-medium text-white">{category === 'sedan' ? 'Luxury Sedan' : 'Self Drive'}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-4">{car.title}</h3>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/918341341186?text=${whatsappMessage}`}
          target="_blank"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
          style={{ backgroundColor: GOLD }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href="tel:+918341341186"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-zinc-200 hover:border-gold hover:text-gold transition text-sm"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
};

// Luxury Sedans Section
const LuxurySedansSection = () => {
  const sedans = [
    { title: "Mercedes‑Maybach S680", img: "/maybach-s680-night.png" },
    { title: "Rolls‑Royce Phantom", img: "/rolls-royce-phantom-night-black.png" },
    { title: "Audi A8L", img: "/black-chauffeur-sedan-night-city.png" },
    { title: "BMW 7 Series", img: "/placeholder.jpg" },
    { title: "Mercedes S‑Class", img: "/placeholder.jpg" },
    { title: "Jaguar XJL", img: "/placeholder.jpg" },
    { title: "Lexus LS", img: "/placeholder.jpg" },
    { title: "Genesis G90", img: "/placeholder.jpg" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury Sedans with a Driver</h3>
        <p className="mt-2 text-sm text-zinc-400">Refined comfort with signature elegance.</p>
      </div>
      <HScroll>
        {sedans.map((s) => (
          <CarItem key={s.title} car={s} category="sedan" />
        ))}
      </HScroll>
    </section>
  );
};

// Self Drive Section
const SelfDriveSection = () => {
  const selfDriveCars = [
    { title: "Ferrari SF90", img: "/ferrari-sf90-black-studio.png" },
    { title: "Lamborghini Aventador", img: "/lamborghini-aventador-black-studio.png" },
    { title: "Porsche 911", img: "/black-supercar-studio-luxury.png" },
    { title: "Lamborghini Huracán", img: "/ferrari-sf90-stradale-black-studio.png" },
    { title: "Bentley Continental GT", img: "/bentley-continental-gt-black-studio.png" },
    { title: "Rolls‑Royce Wraith", img: "/luxury-flagship-cars-in-black-studio.png" },
    { title: "Aston Martin DB11", img: "/placeholder.jpg" },
    { title: "McLaren 720S", img: "/placeholder.jpg" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Hire Luxury Cars for Self Drive</h3>
        <p className="mt-2 text-sm text-zinc-400">Thrilling performance with complete privacy.</p>
      </div>
      <HScroll>
        {selfDriveCars.map((s) => (
          <CarItem key={s.title} car={s} category="self-drive" />
        ))}
      </HScroll>
    </section>
  );
};

// Brand Logos Section
const BrandLogosSection = () => {
  const brands = [
    { name: "Mercedes-Benz", src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
    { name: "BMW", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Audi", src: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Audi-Logo_2016.svg" },
    { name: "Jaguar", src: "https://upload.wikimedia.org/wikipedia/en/0/0a/Jaguar_new_logo.png" },
    { name: "Range Rover", src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Land_Rover_logo_black.svg" },
    { name: "Bentley", src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Bentley_logo.svg" },
    { name: "Rolls‑Royce", src: "https://upload.wikimedia.org/wikipedia/commons/5/55/Rolls-Royce_Motor_Cars_logo.svg" },
    { name: "Porsche", src: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Porsche_Wortmarke.svg" },
    { name: "Ferrari", src: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Ferrari-Logo.svg" },
    { name: "Lamborghini", src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Lamborghini_Logo.svg" },
  ];

  // Duplicate for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">Our Luxury Brand Partners</h2>
        <p className="mt-2 text-sm text-zinc-400">A curated selection of the world's finest marques.</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-black via-black to-black">
        <div className="relative flex gap-8 items-center py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-10 items-center animate-[slide_18s_linear_infinite]">
            {duplicatedBrands.map((b, i) => (
              <div
                key={b.name + i}
                className="shrink-0 h-16 md:h-20 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/15 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                title={b.name}
              >
                <img
                  src={b.src}
                  alt={b.name}
                  className="h-6 md:h-8 w-auto opacity-90 invert-[.92] brightness-200 contrast-75 hover:opacity-100"
                  loading={i < 6 ? "eager" : "lazy"}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Booking Process Section
const BookingProcessSection = () => {
  const steps = [
    { t: "Step 1: Choose Car", d: "Pick your preferred luxury model." },
    { t: "Step 2: Contact Us", d: "Call or WhatsApp for instant assistance." },
    { t: "Step 3: Confirm Booking", d: "Receive your itinerary and confirmation." },
    { t: "Step 4: Enjoy Ride", d: "Sit back and experience true luxury." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 min-h-[420px] md:min-h-[520px]">
        <Image
          src="/black-chauffeur-sedan-night-city.png"
          alt="Luxury booking banner"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80" />

        <div className="relative z-10 p-6 md:p-10 flex items-center justify-center min-h-full">
          <div className="w-full max-w-4xl">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Simple Booking Process</h2>
              <p className="mt-2 text-sm text-zinc-300">Effortless steps to your premium ride.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.t} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h3 className="font-medium text-white text-sm">{s.t}</h3>
                  </div>
                  <p className="mt-2 text-xs text-zinc-300">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">LUXURY</span>
            <span className="text-xl font-bold ml-1" style={{ color: GOLD }}>CARS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-gold transition">Home</a>
            <a href="#" className="text-white hover:text-gold transition">Fleet</a>
            <a href="#" className="text-white hover:text-gold transition">Services</a>
            <a href="#" className="text-white hover:text-gold transition">About</a>
            <a href="#" className="text-white hover:text-gold transition">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-white hover:text-gold transition">Home</a>
              <a href="#" className="text-white hover:text-gold transition">Fleet</a>
              <a href="#" className="text-white hover:text-gold transition">Services</a>
              <a href="#" className="text-white hover:text-gold transition">About</a>
              <a href="#" className="text-white hover:text-gold transition">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-black border-t border-neutral-800 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-4">LUXURY CARS</h3>
          <p className="text-zinc-400 text-sm">Premium luxury car rental services with chauffeur and self-drive options.</p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">CONTACT</h3>
          <p className="text-zinc-400 text-sm">+91 83413 41186</p>
          <p className="text-zinc-400 text-sm">info@luxurycars.example</p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">SERVICES</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Luxury Sedans</li>
            <li>Self Drive</li>
            <li>Airport Transfers</li>
            <li>Corporate Events</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4">FOLLOW US</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-zinc-400 hover:text-white transition">Instagram</a>
            <a href="#" className="text-zinc-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-zinc-400 hover:text-white transition">Facebook</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Luxury Cars. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Hero Section
const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center">
    <div className="absolute inset-0">
      <Image
        src="/black-chauffeur-sedan-night-city.png"
        alt="Luxury car"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
    
    <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Experience <span style={{ color: GOLD }}>Ultimate Luxury</span> on Wheels
      </h1>
      <p className="text-xl text-zinc-300 mb-8">
        Premium chauffeur services and self-drive experiences in Hyderabad
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium"
          style={{ backgroundColor: GOLD, color: '#000' }}
        >
          Book Now
          <ArrowRight className="w-5 h-5" />
        </Link>
        <a
          href="https://wa.me/918341341186"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border border-white text-white hover:border-gold hover:text-gold transition"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp Us
        </a>
      </div>
    </div>
  </section>
);

// Main Page Component
export default function LuxuryCarsHomepage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Luxury Cars | Premium Car Rental Services</title>
        <meta name="description" content="Experience ultimate luxury with our premium car rental services. Chauffeur-driven sedans and self-drive supercars in Hyderabad." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <HeroSection />
        <LuxurySedansSection />
        <SelfDriveSection />
        <BrandLogosSection />
        <BookingProcessSection />
      </main>
      <Footer />
      
      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-\[slide_18s_linear_infinite\] {
          animation: slide 18s linear infinite;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
      `}</style>
    </div>
  );
}