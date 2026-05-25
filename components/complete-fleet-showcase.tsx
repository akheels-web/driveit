'use client';

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

const GOLD = '#b48811';

const allCars = [
  // Luxury Sedans
  { title: "BMW 520D", img: "/sadan/1.jpg", category: "Luxury Sedan", type: "Executive" },
  { title: "Lamborghini Gallardo", img: "/sadan/2.jpg", category: "Super Sports", type: "Exotic" },
  { title: "Lexus ES 300H", img: "/sadan/3.jpg", category: "Hybrid Luxury", type: "Eco-Luxury" },
  { title: "Mercedes S 350", img: "/sadan/4.jpg", category: "Luxury Sedan", type: "Premium" },
  { title: "Mercedes S 450", img: "/sadan/5.jpg", category: "Executive Sedan", type: "Ultra Luxury" },
  { title: "Toyota Camry", img: "/sadan/6.jpg", category: "Business Sedan", type: "Comfort" },
  { title: "Volvo S60 D5", img: "/sadan/7.jpg", category: "Safety Sedan", type: "Premium" },
  { title: "Audi A6", img: "/sadan/8.jpg", category: "Executive Sedan", type: "Business" },
  { title: "Audi RS5 QUATRO", img: "/sadan/9.jpg", category: "Performance Luxury", type: "Sports" },

  // Premium SUVs & MPVs
  { title: "KIA Carnival", img: "/suv/1.jpg", category: "Premium MPV", type: "Family" },
  { title: "Mercedes GLS 350D", img: "/suv/2.jpg", category: "Luxury SUV", type: "Premium" },
  { title: "Mini Cooper Countryman", img: "/suv/3.jpg", category: "Compact SUV", type: "Stylish" },
  { title: "Toyota Commuter (Custom)", img: "/suv/4.jpg", category: "Custom Van", type: "Group Travel" },
  { title: "Toyota Crysta MT", img: "/suv/5.jpg", category: "Premium MPV", type: "Comfort" },
  { title: "Toyota Fortuner", img: "/suv/6.jpg", category: "Reliable SUV", type: "Adventure" },
  { title: "Toyota Vellfire", img: "/suv/7.jpg", category: "Luxury MPV", type: "VIP" },
  { title: "Volvo XC60", img: "/suv/8.jpg", category: "Safety SUV", type: "Premium" },
  { title: "Audi Q7 Quatro", img: "/suv/9.jpg", category: "Luxury SUV", type: "Executive" },

  // Trending & Special Vehicles
  { title: "Mercedes G 350 Wagon", img: "/trending/1.jpg", category: "Luxury Wagon", type: "Off-Road Luxury" },
  { title: "Mercedes GLS 400D", img: "/trending/2.jpg", category: "Ultra Luxury SUV", type: "Premium" },
  { title: "Mercedes V-Class", img: "/trending/3.jpg", category: "Executive Van", type: "Business" },
  { title: "Range Rover Vogue", img: "/trending/4.jpg", category: "Ultra Luxury SUV", type: "VIP" },
  { title: "Volvo S90", img: "/trending/5.jpg", category: "Executive Sedan", type: "Luxury" },
  { title: "Volvo XC 90", img: "/trending/6.jpg", category: "Luxury SUV", type: "Family Premium" },
  { title: "BMW 730 LD", img: "/trending/7.jpg", category: "Executive Sedan", type: "Business Elite" },
  { title: "BMW i4", img: "/trending/8.jpg", category: "Electric Luxury", type: "Eco-Performance" },
  { title: "Mercedes C300 Convertible", img: "/trending/9.jpg", category: "Luxury Convertible", type: "Open-Air Luxury" },
  { title: "Mercedes E 220D", img: "/trending/10.jpg", category: "Executive Sedan", type: "Business" },
];

export default function CompleteFleetShowcase() {
  return (
    <section className="bg-black text-zinc-100 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Complete Luxury Fleet Collection
          </h2>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Discover our comprehensive range of premium vehicles - from executive sedans to luxury SUVs, 
            exotic sports cars to family MPVs. Every occasion deserves the perfect ride.
          </p>
        </div>

        {/* Fleet Categories */}
        <div className="grid gap-8 mb-12">
          {/* Luxury Sedans */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: GOLD }}></div>
              Luxury Sedans & Sports Cars
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allCars.filter(car => car.img.includes('/sadan/')).map((car) => (
                <div key={car.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-gold/50 transition-all duration-300 group">
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={car.img}
                      alt={car.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-medium text-white">{car.type}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{car.title}</h4>
                  <p className="text-sm text-zinc-400 mb-4">{car.category}</p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20${car.title}.`}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
                      style={{ backgroundColor: GOLD }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUVs & MPVs */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: GOLD }}></div>
              Premium SUVs & MPVs
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allCars.filter(car => car.img.includes('/suv/')).map((car) => (
                <div key={car.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-gold/50 transition-all duration-300 group">
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={car.img}
                      alt={car.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-medium text-white">{car.type}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{car.title}</h4>
                  <p className="text-sm text-zinc-400 mb-4">{car.category}</p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20${car.title}.`}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
                      style={{ backgroundColor: GOLD }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending & Special Vehicles */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: GOLD }}></div>
              Trending & Special Collection
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allCars.filter(car => car.img.includes('/trending/')).map((car) => (
                <div key={car.title} className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-gold/50 transition-all duration-300 group">
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={car.img}
                      alt={car.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-medium text-white">Trending</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{car.title}</h4>
                  <p className="text-sm text-zinc-400 mb-4">{car.category}</p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20${car.title}.`}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-black font-medium text-sm hover:scale-105 transition"
                      style={{ backgroundColor: GOLD }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fleet Summary */}
        <div className="text-center bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-4">Complete Fleet at Your Service</h3>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: GOLD }}>30+</div>
              <p className="text-zinc-400">Premium Vehicles</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: GOLD }}>6</div>
              <p className="text-zinc-400">Service Categories</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: GOLD }}>24/7</div>
              <p className="text-zinc-400">Availability</p>
            </div>
          </div>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
            From luxury sedans for executive travel to spacious SUVs for family trips, exotic sports cars for special occasions to reliable MPVs for group transport - we have the perfect vehicle for every need.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 text-black font-medium rounded-full text-base hover:scale-105 transition inline-flex items-center gap-2"
              style={{ backgroundColor: GOLD }}
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/918341341186?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20complete%20fleet%20of%20luxury%20vehicles."
              target="_blank"
              className="px-6 py-3 rounded-full border border-white/20 text-zinc-200 hover:border-gold hover:text-gold transition text-base inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
