'use client'

import { useState } from 'react'
import type { CarDetails } from '@/lib/cars'
import type {
  BespokeProtocolConfig,
  BeyondPanelConfig,
  HeroSceneConfig,
  HomeSectionsConfig,
  PickupHubConfig,
  VipCorridorConfig,
} from '@/lib/home-config'
import type { StatView, TestimonialView } from '@/lib/content-seed'
import { ShowroomHero } from './showroom-hero'
import { InteractiveStudioStage } from './interactive-studio-stage'
import { InteractiveFleetAtelier } from './interactive-fleet-atelier'
import { BeyondPanels } from './beyond-panels'
import { BespokeProtocolAtelier } from './bespoke-protocol-atelier'
import { ClosingDrive } from './closing-drive'
import { QuickBookDrawer, type CommissionAsset } from './quick-book-drawer'

export interface HomeCmsData {
  heroScenes: HeroSceneConfig[]
  pickupHubs: PickupHubConfig[]
  beyondPanels: BeyondPanelConfig[]
  vipCorridors: VipCorridorConfig[]
  protocols?: BespokeProtocolConfig[]
  sections: HomeSectionsConfig
}

export function HypeHomeClient({
  cars,
  whatsappNumber,
  phone,
  homeCms,
  testimonials,
  stats,
}: {
  cars: CarDetails[]
  whatsappNumber: string
  phone: string
  homeCms?: HomeCmsData
  testimonials?: TestimonialView[]
  stats?: StatView[]
}) {
  const [selectedCar, setSelectedCar] = useState<CarDetails | null>(null)
  const [selectedMode, setSelectedMode] = useState<'chauffeur' | 'selfdrive'>('chauffeur')
  const [commissionAsset, setCommissionAsset] = useState<CommissionAsset | null>(null)

  const handleQuickBookCar = (car: CarDetails, mode: 'chauffeur' | 'selfdrive') => {
    setCommissionAsset(null)
    setSelectedCar(car)
    setSelectedMode(mode)
  }

  const handleRequestCommission = (asset: CommissionAsset) => {
    setSelectedCar(null)
    setCommissionAsset(asset)
  }

  const handleCloseDrawer = () => {
    setSelectedCar(null)
    setCommissionAsset(null)
  }

  return (
    <main className="bg-[#040405] text-zinc-100">
      <ShowroomHero
        onRequestCommission={handleRequestCommission}
        scenes={homeCms?.heroScenes}
        hubs={homeCms?.pickupHubs}
      />
      <InteractiveStudioStage
        cars={cars}
        eyebrow={homeCms?.sections.studioStageEyebrow}
        title={homeCms?.sections.studioStageTitle}
        onQuickBookCar={handleQuickBookCar}
      />
      <InteractiveFleetAtelier
        cars={cars}
        eyebrow={homeCms?.sections.fleetSectionEyebrow}
        title={homeCms?.sections.fleetSectionTitle}
        subtitle={homeCms?.sections.fleetSectionSubtitle}
        onQuickBookCar={handleQuickBookCar}
        onRequestCommission={handleRequestCommission}
      />
      <BeyondPanels
        panels={homeCms?.beyondPanels}
        eyebrow={homeCms?.sections.beyondEyebrow}
        title={homeCms?.sections.beyondTitle}
        subtitle={homeCms?.sections.beyondSubtitle}
        onRequestCommission={handleRequestCommission}
      />
      <BespokeProtocolAtelier
        protocols={homeCms?.protocols}
        eyebrow={homeCms?.sections.protocolEyebrow}
        title={homeCms?.sections.protocolTitle}
        subtitle={homeCms?.sections.protocolSubtitle}
        testimonials={testimonials}
        stats={stats}
        whatsappNumber={whatsappNumber}
      />
      <ClosingDrive
        whatsappNumber={whatsappNumber}
        phone={phone}
        sections={homeCms?.sections}
        onRequestCommission={handleRequestCommission}
      />

      {(selectedCar || commissionAsset) && (
        <QuickBookDrawer
          key={`${selectedCar?.slug ?? ''}-${commissionAsset?.title ?? ''}-${selectedMode}`}
          car={selectedCar}
          commission={commissionAsset}
          initialMode={selectedMode}
          hubs={homeCms?.pickupHubs}
          onClose={handleCloseDrawer}
        />
      )}
    </main>
  )
}
