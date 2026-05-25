'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
]

export function Showcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">

        {/* --- Section 1: Jet + Yacht --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Chauffeur Luxury Service */}
          <div className="relative h-80 md:h-[450px] rounded-xl overflow-hidden">
            <Image
              src="https://i.pinimg.com/736x/68/b9/c2/68b9c2fe5a114be8de36d53873d39041.jpg"
              alt="Chauffeur luxury car service Hyderabad"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 m-4">
              <h3 className="text-lg font-semibold text-white drop-shadow">Chauffeur Luxury Service</h3>
              <p className="text-sm text-white/90 drop-shadow">Executive rides with professional chauffeurs, on time and in style.</p>
            </div>
            <Link href="/services/airport-taxi">
              <button 
                className="absolute top-4 right-4 text-black px-4 py-2 rounded-full font-medium transition-colors duration-300 shadow-2xl"
                style={{ backgroundColor: '#b48811' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c69c1a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b48811'}
              >
                Discover More
              </button>
            </Link>
          </div>

          {/* Luxury Cars */}
          <div className="relative h-80 md:h-[450px] rounded-xl overflow-hidden">
            <Image
              src="https://i.pinimg.com/736x/b7/0a/ea/b70aea52ac1e2b17283c01327323309b.jpg"
              alt="Premium luxury car rental Hyderabad"
              fill
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 m-4">
              <h3 className="text-lg font-semibold text-white drop-shadow">Luxury Cars</h3>
              <p className="text-sm text-white/90 drop-shadow">Explore our premium fleet of luxury vehicles.</p>
            </div>
            <Link href="/services/luxury-car-rental">
              <button 
                className="absolute top-4 right-4 text-black px-4 py-2 rounded-full font-medium transition-colors duration-300 shadow-2xl"
                style={{ backgroundColor: '#b48811' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c69c1a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b48811'}
              >
                Discover More
              </button>
            </Link>
          </div>
        </div>

        {/* --- Section 2: Luxury Wedding Cars (Full Width) --- */}
        <div className="mb-10">
          <div className="relative h-72 sm:h-96 md:h-[500px] rounded-xl overflow-hidden">
            <Link href="/services/wedding-cars" aria-label="Wedding Cars">
              <span className="absolute inset-0 z-10" />
            </Link>
            <Link href="/services/wedding-cars" className="absolute top-4 right-4 z-20">
              <button 
                className="text-black px-4 py-2 rounded-full font-medium transition-colors duration-300 shadow-2xl"
                style={{ backgroundColor: '#b48811' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c69c1a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b48811'}
              >
                Discover More
              </button>
            </Link>
            <Image
              src="https://i.pinimg.com/736x/09/f9/44/09f944012c94c6a5b75bffa4e11333c5.jpg"
              alt="Luxury wedding car rentals in Hyderabad"
              fill
              className="object-cover w-full h-full"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 m-4">
              <h4 className="text-xl md:text-2xl font-semibold text-white drop-shadow">Wedding Cars</h4>
              <p className="text-sm md:text-base text-white/90 drop-shadow">Make your big day unforgettable with our elegant wedding fleet.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

