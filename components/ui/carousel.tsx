import React from 'react'
import Image from 'next/image'

export default function Mission() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background Banner Image with Mission & Vision Text Overlay */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] w-full">
        <Image
          src="/luxury-flagship-cars-in-black-studio.png"
          alt="Luxury Mission & Vision Banner"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Mission & Vision Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-6xl mx-auto px-6">
            {/* Mission Section */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                Our Mission
              </h2>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl max-w-4xl mx-auto mb-6">
                <p className="text-base md:text-lg leading-relaxed font-light text-white">
                  To be the world's leading luxury mobility platform providing unparalleled service, exclusivity, and innovation. Hype Luxury envisions redefining ultra-luxury experiences through cutting-edge technology, strategic global partnerships, and bespoke services, setting new benchmarks in elite mobility and premium lifestyle.
                </p>
              </div>
            </div>

            {/* Vision Section */}
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                Our Vision
              </h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl max-w-4xl mx-auto">
                <p className="text-base md:text-lg leading-relaxed font-light text-white">
                  To revolutionize the luxury mobility industry by creating seamless, personalized experiences that exceed the highest expectations. We strive to be the benchmark for excellence, innovation, and exclusivity in premium transportation services worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}