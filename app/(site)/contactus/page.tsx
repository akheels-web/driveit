"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Car, Plane, Anchor } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use your actual Telegram credentials
  const TELEGRAM_BOT_TOKEN = "8068562276:AAFP_ToBxZXbbVmK1gvnnMZYeURT9nTPm6c";
  const TELEGRAM_CHAT_ID = "6163736948";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const location = formData.get("location") as string;
    const message = formData.get("message") as string;

    const telegramMessage = `🚗 DRIVEIT Luxury Service Request

Name: ${name}
Phone: ${phone}
Service: ${service}
Location: ${location}
Message: ${message}`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
          }),
        }
      );

      const data = await res.json();

      if (data.ok) {
        // Force redirect to thank you page
        window.location.href = "/thankyou";
      } else {
        alert("Error sending message. Please call +91 83413 41186");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error! Please call +91 83413 41186");
      setLoading(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:+918341341186'
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-800">
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b48811' }}>
              <MessageSquare className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Contact <span style={{ color: '#b48811' }}>DRIVEIT</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Get in touch for luxury transportation services
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
                +91 83413 41186
              </button>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name*"
                  required
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                  style={{ borderColor: '#b48811' }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  required
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                  style={{ borderColor: '#b48811' }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="service"
                  required
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                  style={{ borderColor: '#b48811' }}
                >
                  <option value="">Select Service</option>
                  <option value="Luxury Car Rental">Luxury Car Rental</option>
                  <option value="Private Jet Services">Private Jet Services</option>
                  <option value="Yacht Services">Yacht Services</option>
                  <option value="Wedding Cars">Wedding Cars</option>
                  <option value="Corporate Events">Corporate Events</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                  <option value="Chauffeur Service">Chauffeur Service</option>
                </select>
                <select
                  name="location"
                  required
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                  style={{ borderColor: '#b48811' }}
                >
                  <option value="">Pickup Location</option>
                  <option>Gachibowli</option>
                  <option>Madhapur</option>
                  <option>Hitech City</option>
                  <option>Kokapet</option>
                  <option>Jubilee Hills</option>
                  <option>Kondapur</option>
                  <option>Nanakramguda</option>
                  <option>Hyderabad Airport</option>
                  <option>Secunderabad</option>
                  <option>Others</option>
                </select>
              </div>

              <textarea
                name="message"
                placeholder="Tell us about your requirements*"
                required
                className="p-3 rounded-lg w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition min-h-[110px]"
                style={{ borderColor: '#b48811' }}
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
                  Call +91 83413 41186
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