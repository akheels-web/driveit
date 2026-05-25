"use client"

import React from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "CEO, TechSolutions India",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's luxury car service in Hyderabad is exceptional. Their Rolls-Royce for our corporate events always impresses our international clients. Professional chauffeurs and impeccable service.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Wedding Planner, Elegant Events",
    image: "/placeholder-user.jpg",
    quote: "Used DRIVEIT for multiple luxury weddings in Hyderabad. Their wedding car collection is stunning and the service is flawless. Every bride feels like royalty on their special day.",
    rating: 5
  },
  {
    name: "Arjun Reddy",
    role: "Managing Director, RedTech Industries",
    image: "/placeholder-user.jpg",
    quote: "For our executive transportation needs in Hyderabad, DRIVEIT is our go-to choice. Their luxury fleet and professional service make every business trip memorable and comfortable.",
    rating: 5
  },
  {
    name: "Anjali Patel",
    role: "Luxury Travel Consultant",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's private jet services from Hyderabad are world-class. They handle everything from airport transfers to international travel seamlessly. Highly recommended for luxury travel.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Director, Singh Hospitality Group",
    image: "/placeholder-user.jpg",
    quote: "Outstanding luxury transportation service in Hyderabad. Their fleet of premium cars and attention to detail is unmatched. Perfect for our high-profile guests and events.",
    rating: 5
  },
  {
    name: "Meera Iyer",
    role: "Event Manager, Grand Celebrations",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's luxury bus service for our corporate events in Hyderabad is excellent. Comfortable, punctual, and adds a touch of elegance to any group transportation need.",
    rating: 5
  }
]

export default function Testimonials() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.12 }
    )
    const section = document.getElementById('testimonials-section')
    if (section) observer.observe(section)
    return () => {
      if (section) observer.unobserve(section)
    }
  }, [])

  return (
    <section id="testimonials-section" className="bg-black text-white overflow-hidden">
      <div className="py-8 md:py-12">
        <div className={`text-center mb-6 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Client Testimonials
          </h3>
          <p className="text-sm text-white/80">
            What our clients in Hyderabad say about their luxury experience
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name + i}
                className={`relative p-6 rounded-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transition: 'opacity 700ms ease, transform 700ms ease', transitionDelay: `${i * 90}ms` }}
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <Quote className="w-6 h-6" style={{ color: '#b48811' }} />
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-sm text-white/80 text-center mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Rating Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-current"
                      style={{ color: '#b48811' }}
                    />
                  ))}
                </div>

                {/* Client Info */}
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name} client testimonial Hyderabad`}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-xs text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}