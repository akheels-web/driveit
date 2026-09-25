"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Car, Plane, Anchor } from "lucide-react";
import { LuxurySelect } from "@/components/luxury-select";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const location = formData.get("location") as string;
    const message = formData.get("message") as string;

    try {
      // The enquiry is delivered by the server so the bot credentials never
      // reach the browser and submissions are rate limited + sanitised.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service,
          message: `${message}\n\nPickup location: ${location}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.push("/thankyou");
        return;
      }

      setError(data.error || "We could not send your message. Please call +91 63000 41186.");
      setLoading(false);
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Network error. Please call +91 63000 41186.");
      setLoading(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:+916300041186'
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden bg-zinc-900 relative">
        {/* Navigation Back */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 backdrop-blur-sm transition-colors"
        >
          ← Return to site
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="px-6 pt-12 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#b48811' }}>
              <MessageSquare className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
              Contact <span style={{ color: '#b48811' }}>DRIVEIT</span>
            </h1>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Get in touch for luxury transportation services in Hyderabad
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="relative bg-zinc-900">
          <div className="p-6 sm:p-8">
            <p className="text-zinc-400 text-sm text-center mb-6">
              For immediate assistance, call{" "}
              <button
                onClick={handleCall}
                className="font-semibold text-gold hover:text-yellow-400 underline"
                style={{ color: '#b48811' }}
              >
                +91 63000 41186
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  className="p-3.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--gold-400)] focus:ring-2 focus:ring-[var(--gold-400)]/20 outline-none transition text-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  className="p-3.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--gold-400)] focus:ring-2 focus:ring-[var(--gold-400)]/20 outline-none transition text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LuxurySelect
                  name="service"
                  value={service}
                  onChange={setService}
                  placeholder="Select Service"
                  options={[
                    { value: "Luxury Car Rental", label: "Luxury Car Rental" },
                    { value: "Private Jet Services", label: "Private Jet Services" },
                    { value: "Yacht Services", label: "Yacht Services" },
                    { value: "Wedding Cars", label: "Wedding Cars" },
                    { value: "Corporate Events", label: "Corporate Events" },
                    { value: "Airport Transfer", label: "Airport Transfer" },
                    { value: "Chauffeur Service", label: "Chauffeur Service" },
                  ]}
                />
                <LuxurySelect
                  name="location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Pickup Location"
                  options={[
                    { value: "Gachibowli", label: "Gachibowli" },
                    { value: "Madhapur", label: "Madhapur" },
                    { value: "Hitech City", label: "Hitech City" },
                    { value: "Kokapet", label: "Kokapet" },
                    { value: "Jubilee Hills", label: "Jubilee Hills" },
                    { value: "Kondapur", label: "Kondapur" },
                    { value: "Nanakramguda", label: "Nanakramguda" },
                    { value: "Hyderabad Airport", label: "Hyderabad Airport" },
                    { value: "Secunderabad", label: "Secunderabad" },
                    { value: "Others", label: "Others" },
                  ]}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg" role="alert">
                  {error}
                </p>
              )}

              <textarea
                name="message"
                placeholder="Tell us about your requirements *"
                required
                className="p-3.5 rounded-xl w-full bg-zinc-800/90 border border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--gold-400)] focus:ring-2 focus:ring-[var(--gold-400)]/20 outline-none transition text-sm min-h-[110px]"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-black font-bold py-3.5 rounded-lg shadow-lg transition flex items-center justify-center hover:scale-105 duration-300"
                style={{ backgroundColor: '#b48811' }}
              >
                {!loading ? (
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    SEND MESSAGE
                  </span>
                ) : (
                  <div className="animate-spin border-4 border-black/70 border-t-transparent h-6 w-6 rounded-full"></div>
                )}
              </button>

              <div className="text-center text-sm text-zinc-500">
                Prefer talking to a person?{" "}
                <button
                  onClick={handleCall}
                  className="font-semibold hover:text-yellow-400"
                  style={{ color: '#b48811' }}
                >
                  Call +91 63000 41186
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="h-1" style={{ backgroundColor: '#b48811' }}></div>
      </div>
    </div>
  );
}