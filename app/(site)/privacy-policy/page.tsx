"use client"
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--luxury-bg)] text-zinc-100 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-16">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[var(--gold-400)] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--gold-400)] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-white mb-4">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
            How we protect and handle your personal information at DRIVEIT Luxury
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" style={{ color: '#b48811' }} />
              Information We Collect
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This may include your name, email address, phone number, payment information, and travel preferences.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" style={{ color: '#b48811' }} />
              How We Use Your Information
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5" style={{ color: '#b48811' }} />
              Information Sharing
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Data Security
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at +91 63000 41186 or through our contact form.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-2">DriveIt Luxury Terms and Conditions (India)</h2>
            <p className="text-zinc-400 leading-relaxed">
              By booking with DriveIt Luxury, you agree to these Terms and Conditions governing our chauffeur-driven and self-drive luxury car rentals. Vehicles are provided as-is; colors, models, and features may vary. Unavailable vehicles will be replaced with comparable alternatives, subject to availability.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-4">
            <h3 className="text-xl font-semibold text-white">Chauffeur-Driven Cars</h3>
            <div>
              <h4 className="font-medium text-white mb-2">Eligibility</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Minimum age: 18. Minors under 18 must be accompanied by an adult.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Booking Process</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Book via app/website, selecting journey and vehicle type.</li>
                <li>Customer pays tolls, taxes, parking fees, and any vehicle damages.</li>
                <li>Distance/time calculated garage-to-garage.</li>
                <li>Airport transfers are separate; confirm availability.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Customer Responsibilities</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Chauffeurs adhere to RTO regulations for speed, routes, and driving.</li>
                <li>Prohibited: Influencing reckless driving, abusing chauffeurs, or overloading passengers (trip cancelled without refund).</li>
                <li>Chauffeurs may deny boarding for hazards (e.g., alcohol, illegal items, etc.); trip may end without notice.</li>
                <li>Any illegal activities, money laundering, and items (firearms, drugs, etc.) terminate trip.</li>
                <li>Maximum: 12 hours or 300 km daily, whichever comes first.</li>
                <li>Treat chauffeurs respectfully; violations may lead to legal action.</li>
                <li>Contact: <a href="mailto:care@driveitluxury.in" className="underline">care@driveitluxury.in</a> or +91 63000 41186</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Vehicle Replacement</h4>
              <p className="text-zinc-400 leading-relaxed">Provided within city limits for mechanical issues, subject to availability. No outstation replacements; full rental charged.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Indemnity</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>User releases DriveIt Luxury from liability for property loss/damage.</li>
                <li>User indemnifies DriveIt Luxury against losses, damages, accidents, or injuries from vehicle use or negligence.</li>
                <li>User liable for Motor Vehicles Act, 1988 violations, including penalties, accidents, or third-party claims.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Disclaimer</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Services used at user’s risk; no warranties on condition or fitness.</li>
                <li>DriveIt Luxury not liable for losses from service use or failure.</li>
                <li>Vehicle colors and variants may vary.</li>
              </ul>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-4">
            <h3 className="text-xl font-semibold text-white">Self-Drive Cars</h3>
            <div>
              <h4 className="font-medium text-white mb-2">Eligibility</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Minimum age: 25+; valid driving license for 5+ years.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Booking Process</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Submit DL/Aadhaar (Indian) or International Permit/Passport (Foreign) pre-booking; and at vehicle receiving submit all original docs.</li>
                <li>Booker liable for third-party drivers; breach voids claims.</li>
                <li>Delivery/pickup by DriveIt Luxury (chargeable from deposit).</li>
                <li>Pricing based on agreed destination; changes may affect costs.</li>
                <li>Daily limit: 100 km; extra km charged.</li>
                <li>Security deposit varies; refunds in 15-30 days post-evaluation, extendable for damages or disputes.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Customer Responsibilities</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Inspect vehicle at delivery; no later complaints.</li>
                <li>Bumper-to-bumper insurance valid only for extreme damages/total loss; rental will be charged till insurance debited and repair time taken; damages deducted from deposit, excess billed.</li>
                <li>Speed limit: 100 km/h; Rs. 1500 penalty per violation.</li>
                <li>No alcohol/smoking; cleaning fees apply.</li>
                <li>Customer pays taxes, tolls, violations, fuel (full-to-full or same return as given).</li>
                <li>Cover damage/downtime costs.</li>
                <li>Provide parking address; no street parking (GPS-monitored; penalties apply).</li>
                <li>No abandoning vehicles without approval; deposit forfeiture possible.</li>
                <li>Prohibited: Pets, damaging goods, illegal items, overloading, commercial use, or racing, etc.</li>
                <li>Wrong fueling: Customer covers costs, including demurrage.</li>
                <li>I am taking the vehicle start running condition and will return same start running condition.</li>
                <li>In security I am submitting my passport + Deposit + cheques and other proofs required.</li>
                <li>Services limited to specified areas; unauthorized travel at user’s risk with penalties starting from Rs.50,000/- and deposit not refundable.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Tyre Damage</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Repair/replacement costs from deposit; inspection upon return with photos.</li>
                <li>Pre-journey inspection advised; avoid rough terrain.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Vehicle Replacement</h4>
              <p className="text-zinc-400 leading-relaxed">City-limits only for mechanical issues; no outstation replacement, full charge applies.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Indemnity</h4>
              <p className="text-zinc-400 leading-relaxed">As per chauffeur section.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Disclaimer</h4>
              <p className="text-zinc-400 leading-relaxed">As per chauffeur section.</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-4">
            <h3 className="text-xl font-semibold text-white">General Terms</h3>
            <div>
              <h4 className="font-medium text-white mb-2">Eligibility</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>18+; minors with adults. Self-drive per specific terms.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Booking Process</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Issued to booker; misuse by others cancels trip without refund.</li>
                <li>DriveIt Luxury may refuse bookings without explanation.</li>
                <li>Booker responsible for vehicle condition.</li>
                <li>Technical errors may lead to cancellations with partial refund (depends on discussion).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Cancellations</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Confirm prior 4 days before booking day 50% refund; 7 days before booking 60%.</li>
                <li>No gateway fee refunds.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Customer Responsibilities</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Chauffeurs vaccinated/trained.</li>
                <li>Vehicles as-is; model preferences subject to availability.</li>
                <li>Recall for safety/breaches; refunds evaluated.</li>
                <li>Liable for illegal use or traffic violations.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Vehicle Replacement</h4>
              <p className="text-zinc-400 leading-relaxed">As per chauffeur section.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Indemnity</h4>
              <p className="text-zinc-400 leading-relaxed">As per chauffeur section.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Geo-Fencing Technology</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Location data collected for safety/optimization.</li>
                <li>Comply with designated zones; no tampering.</li>
                <li>DriveIt Luxury not liable for data inaccuracies.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Pricing Disclaimer</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Pricing errors may lead to booking cancellations.</li>
                <li>DriveIt Luxury reserves the right to review and cancel mispriced bookings.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Disclaimer</h4>
              <ul className="list-disc pl-6 text-zinc-400 leading-relaxed">
                <li>Services used at user’s risk; no warranties.</li>
                <li>Only booker should drive in self-drive service; if not, penalty applies.</li>
                <li>DriveIt Luxury not liable for losses from service use or failure.</li>
              </ul>
              <p className="text-zinc-400 leading-relaxed mt-2">Note: Terms updated regularly; latest apply. Contact <a href="mailto:care@driveitluxury.in" className="underline">care@driveitluxury.in</a>.</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-zinc-500 hover:text-[var(--gold-400)] transition-colors mx-auto text-sm py-2 px-4 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
