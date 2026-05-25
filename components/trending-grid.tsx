'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { ArrowRight, Car, Plane, MapPin, Bus, Heart, Route, Building, Clock, Van } from "lucide-react"

const services = [
  {
    title: "LUXURY CHAUFFEUR",
    href: "/services/airport-taxi",
    img: "https://i.pinimg.com/736x/3d/2a/3a/3d2a3af540773bbad9f139450a63864c.jpg",
    desc: "Premium chauffeur service",
    icon: Car,
  },
  {
    title: "LUXURY CAR RENTAL",
    href: "/services/luxury-car-rental",
    img: "https://i.pinimg.com/736x/5a/53/96/5a539624d67f7236ac456aaeaf101517.jpg",
    desc: "Flagship cars, chauffeur or self-drive",
    icon: Car,
  },
  {
    title: "PRIVATE JET SERVICES",
    href: "/services/private-jet-services",
    img: "https://i.pinimg.com/736x/a1/13/54/a113547a7672e15380e878416e7cb1af.jpg",
    desc: "Global access to premium jets",
    icon: Plane,
  },
  {
    title: "PICKUP & DROP-OFF",
    href: "/services/pickup-dropoff",
    img: "https://i.pinimg.com/1200x/f1/84/eb/f184ebe4acf3eba81044d3c9b7ba2c12.jpg",
    desc: "On-time executive transfers",
    icon: MapPin,
  },
  {
    title: "LUXURY BUSES",
    href: "/services/luxury-buses",
    img: "https://i.pinimg.com/736x/17/f8/75/17f8753a70089849b702071dec38b9ec.jpg",
    desc: "Group travel in absolute comfort",
    icon: Bus,
  },
  {
    title: "WEDDING CARS",
    href: "/services/wedding-cars",
    img: "https://i.pinimg.com/736x/a4/f6/95/a4f6959bf69c97005baaefc48f634f1f.jpg",
    desc: "Iconic arrivals for your day",
    icon: Heart,
  },
  {
    title: "AIRPORT TAXI",
    href: "/services/airport-taxi",
    img: "https://i.pinimg.com/736x/3d/2a/3a/3d2a3af540773bbad9f139450a63864c.jpg",
    desc: "Premium airport transportation",
    icon: Car,
  },
  {
    title: "CORPORATE CAR RENTAL",
    href: "/services/corporate-car-rental",
    img: "https://i.pinimg.com/736x/d2/6b/86/d26b8690789253c15f60c954cb510e6d.jpg",
    desc: "Business travel solutions",
    icon: Building,
  },
 

]

export function TrendingGrid() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('trending-section')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <section id="trending-section" className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="text-left sm:text-left mb-4 sm:mb-0">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Our Services
              </h2>
              <p className="text-sm text-white/80">
                Explore our wide selection of high-quality cars.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-gold/20 hover:border-gold/30"
            >
              Discover More
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, i) => (
            <Link
              key={service.href}
              href={service.href}
              className={`group relative h-80 md:h-[450px] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transition: 'opacity 700ms ease, transform 700ms ease', transitionDelay: `${i * 90}ms` }}
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay - same as showcase */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Content overlay - clean, left-aligned (no transparent background) */}
              <div className="absolute bottom-0 left-0 m-4">
                <h3 className="text-lg font-semibold text-white drop-shadow">{service.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-white/90 drop-shadow">{service.desc}</p>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: '#b48811' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}