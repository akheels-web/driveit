import { Car } from "lucide-react"
import { SiBmw, SiAudi, SiToyota, SiVolvo, SiMini, SiKia, SiLamborghini } from 'react-icons/si'

const MercedesIcon = ({ className, color }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v10l-8 6M12 12l8 6" />
  </svg>
)

const LexusIcon = ({ className, color }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M14 6L8 15h8" />
  </svg>
)

export const BrandIcon = ({ brand, className }: { brand: string, className?: string }) => {
  const c = className || "w-6 h-6";
  switch (brand.toLowerCase()) {
    case 'bmw': return <SiBmw className={c} color="#0066B1" />
    case 'audi': return <SiAudi className={c} color="#ffffff" />
    case 'toyota': return <SiToyota className={c} color="#EB0A1E" />
    case 'volvo': return <SiVolvo className={c} color="#003057" />
    case 'mini': return <SiMini className={c} color="#ffffff" />
    case 'kia': return <SiKia className={c} color="#ffffff" />
    case 'lamborghini': return <SiLamborghini className={c} color="#D4AF37" />
    case 'land rover': return <Car className={c} color="#005A2B" />
    case 'mercedes': return <MercedesIcon className={c} color="#ffffff" />
    case 'lexus': return <LexusIcon className={c} color="#ffffff" />
    default: return <Car className={c} />
  }
}
