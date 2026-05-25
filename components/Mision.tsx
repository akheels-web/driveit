import React from "react"
import Image from "next/image"
import Link from "next/link"
import { RevealOnScroll } from "./reveal-on-scroll"

export default function Mision() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
                   {/* Background Banner Image */}
                   <div className="relative h-96 sm:h-96 md:h-[500px] lg:h-[600px] xl:h-[700px] w-full">
        <Image
          src="/luxury-flagship-cars-in-black-studio.png"
          alt="Luxury Mission Banner"
          fill
          className="object-cover w-full h-full"
          loading="lazy"
        />
        

        {/* Mission Content at Bottom */}
        <div className="absolute inset-0 flex items-end justify-center px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12">
          <div className="text-center w-full max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
            <RevealOnScroll>
              <h2
                className="reveal text-2xl md:text-3xl font-semibold text-white drop-shadow"
                style={{ transitionDelay: "60ms" }}
              >
                Our Mission
              </h2>

              <div
                className="reveal rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mx-2 sm:mx-auto"
                style={{ transitionDelay: "140ms" }}
              >
                <p className="reveal text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-light text-white drop-shadow mb-3 sm:mb-4" style={{ transitionDelay: "200ms" }}>
                  DRIVEIT Luxury aims to be the world's leading luxury mobility platform, offering unmatched service, exclusivity, and innovation. We redefine ultra-luxury travel with cutting-edge technology, global partnerships, and personalized experiences—setting new standards in premium lifestyle and elite mobility.
                </p>

                {/* Learn More Button */}
                <Link
                  href="/about"
                  className="reveal inline-block text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300"
                  style={{ backgroundColor: '#b48811', transitionDelay: "260ms" }}
                >
                  Learn More
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}