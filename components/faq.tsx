import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    q: "Do you offer 24/7 concierge service?",
    a: "Yes, our luxury concierge team operates 24/7 to accommodate last-minute bookings, changes, and special requests. We're always available to ensure your luxury travel experience is seamless.",
  },
  {
    q: "Can I request a professional chauffeur?",
    a: "Absolutely. Professional, trained chauffeurs are available for all our luxury vehicles. They are experienced in providing discreet, high-quality service for corporate and personal travel.",
  },
  {
    q: "What documents are required for luxury car rental?",
    a: "For self-drive rentals, we require a valid driver's license, passport/ID, and a security deposit. For chauffeur services, only your booking confirmation is needed.",
  },
  {
    q: "Do you arrange intercity and international travel?",
    a: "Yes, we provide comprehensive intercity travel services and coordinate private jet charters for international routes. Our team handles all logistics and arrangements.",
  },
  {
    q: "What types of luxury vehicles do you offer?",
    a: "Our fleet includes flagship luxury cars, private jets, yachts, luxury buses, and wedding cars. We offer everything from Rolls-Royce and Bentley to private aviation and marine vessels.",
  },
  {
    q: "How far in advance should I book?",
    a: "For peak seasons and special events, we recommend booking 2-4 weeks in advance. However, we can accommodate last-minute requests subject to availability.",
  },
  {
    q: "Do you provide airport transfer services?",
    a: "Yes, we offer premium airport transportation with meet-and-greet services, flight tracking, and luggage assistance. Our drivers ensure timely arrivals and departures.",
  },
  {
    q: "How do I contact you for bookings?",
    a: "You can reach us 24/7 at +91 83413 41186, email us at info@driveit.com, or use our contact form. Our team will assist you with all your luxury transportation needs.",
  },
]

export function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-white/80 mt-2">
            Everything you need to know about our luxury transportation services
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((f, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="border border-white/20 rounded-lg"
              >
                <AccordionTrigger className="text-left hover:text-white/80 px-4 py-3 text-lg font-semibold text-white">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/80 px-4 pb-3 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}