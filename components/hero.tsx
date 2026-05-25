'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById('services')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative bg-black text-white overflow-hidden"
    >
      {/* Heading */}
      <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl mt-8 md:mt-10">
        <h1
          className={`text-2xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-snug transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          The{" "}
          <span style={{ color: '#b48811' }}>Art of Luxury</span>
        </h1>
        <p className="mt-4 text-gray-300 max-w-xl mx-auto text-base md:text-lg">
          Experience elegance and innovation.
        </p>
        <button 
          onClick={scrollToServices}
          className="mt-6 px-6 md:px-8 py-3 text-black font-medium rounded-full shadow transition text-sm md:text-base hover:scale-105 transition-all duration-300 cursor-pointer"
          style={{ backgroundColor: '#b48811' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c69c1a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b48811'}
        >
          Explore
        </button>
      </div>

      {/* Full-width Car Showcase Strip */}
      <div className="relative mt-8 md:mt-12 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-2xl md:rounded-none">
            <Image
              src="https://i.pinimg.com/736x/9d/fb/64/9dfb642b6cf8511365d2d3000fe01f10.jpg"
              alt="Rolls Royce"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-2xl md:rounded-none">
            <Image
              src="https://i.pinimg.com/736x/d1/3f/89/d13f89cc042bb2f63ebe63d2cd841e70.jpg"
              alt="Ferrari SF90"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-2xl md:rounded-none">
            <Image
              src="https://i.pinimg.com/1200x/f8/c5/f9/f8c5f92b0d721cda2270948c5a1b4074.jpg"
              alt="Lamborghini Aventador"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Curved bottom effect */}
        <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-black rounded-t-[60%] md:rounded-t-[50%]"></div>
      </div>
    </section>
  );
}