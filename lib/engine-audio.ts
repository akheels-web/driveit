// Web Audio API Real Engine Sound Synthesizer for DRIVEIT Luxury Mobility
// Distinct procedural audio topologies per powertrain architecture so every vehicle
// sounds unmistakably unique even on laptop/mobile speakers:
// 1. Rolls-Royce V12 ("Whisper Turbine")
// 2. Aston Martin DB12 Twin-Turbo V8 ("Muscular Burble + Turbo Spool + Wastegate Flutter")
// 3. Ferrari SF90 Hybrid Flat-Plane V8 ("High-Voltage eMotor Glide + High-RPM F1 Bark")
// 4. Mercedes-AMG G 63 Cross-Plane V8 ("Asymmetric Idle Chop + Side-Exit Overrun Pops")
// 5. Lamborghini Huracán Evo 5.2L NA V10 ("Odd-Order Brassy Italian V10 Wail")

export type EngineType = 'v12-whisper' | 'v8-twinturbo' | 'v8-hybrid' | 'v8-amg' | 'v10-screamer'

export interface EngineSoundInstance {
  stop: () => void
  rev: () => void
}

let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx()
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {})
  }
  return sharedAudioCtx
}

function makeWarmSaturationCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 1024
  const buffer = new ArrayBuffer(samples * 4)
  const curve = new Float32Array(buffer)
  const k = Math.max(1, amount * 45)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x))
  }
  return curve
}

export function playEngineAcoustic(
  engineType: EngineType = 'v12-whisper',
  onEnded?: () => void,
): EngineSoundInstance {
  const ctx = getAudioContext()
  if (!ctx) {
    return { stop: () => {}, rev: () => {} }
  }

  const now = ctx.currentTime

  // Soft compressor prevents speaker clipping across resonant sweeps
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.setValueAtTime(-16, now)
  compressor.knee.setValueAtTime(18, now)
  compressor.ratio.setValueAtTime(6, now)
  compressor.attack.setValueAtTime(0.005, now)
  compressor.release.setValueAtTime(0.15, now)

  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.0001, now)
  compressor.connect(masterGain)
  masterGain.connect(ctx.destination)

  const activeOscs: OscillatorNode[] = []
  const activeSources: AudioBufferSourceNode[] = []
  let isStopped = false

  // Shared filtered noise generator (reused for airflow, turbo flutter, exhaust crackles)
  const bufferSize = Math.floor(ctx.sampleRate * 2)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const noiseChannel = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    noiseChannel[i] = Math.random() * 2 - 1
  }

  const triggerOverrunPop = (delaySec: number, pitchHz = 170, loudness = 0.28) => {
    if (isStopped) return
    const t = ctx.currentTime + delaySec
    const popNoise = ctx.createBufferSource()
    popNoise.buffer = noiseBuffer

    const popBand = ctx.createBiquadFilter()
    popBand.type = 'bandpass'
    popBand.frequency.setValueAtTime(pitchHz * 2.8, t)
    popBand.Q.setValueAtTime(2.5, t)

    const popThump = ctx.createOscillator()
    popThump.type = 'triangle'
    popThump.frequency.setValueAtTime(pitchHz, t)
    popThump.frequency.exponentialRampToValueAtTime(48, t + 0.08)

    const popEnv = ctx.createGain()
    popEnv.gain.setValueAtTime(0.0001, t)
    popEnv.gain.linearRampToValueAtTime(loudness, t + 0.008)
    popEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.095)

    popNoise.connect(popBand)
    popBand.connect(popEnv)
    popThump.connect(popEnv)
    popEnv.connect(compressor)

    popNoise.start(t)
    popThump.start(t)
    popNoise.stop(t + 0.11)
    popThump.stop(t + 0.11)
  }

  const triggerWastegateFlutter = (delaySec: number) => {
    if (isStopped) return
    // Distinct 3-pulse twin-scroll turbo flutter ("pshh-tu-tu-tu")
    ;[0, 0.085, 0.165, 0.24].forEach((offset, idx) => {
      const t = ctx.currentTime + delaySec + offset
      const src = ctx.createBufferSource()
      src.buffer = noiseBuffer

      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.setValueAtTime(2800 - idx * 350, t)
      bp.Q.setValueAtTime(6.5, t)

      const g = ctx.createGain()
      const amp = 0.14 * Math.pow(0.7, idx)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(amp, t + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075)

      src.connect(bp)
      bp.connect(g)
      g.connect(compressor)
      src.start(t)
      src.stop(t + 0.085)
    })
  }

  let revHandler = () => {}

  if (engineType === 'v12-whisper') {
    // ── ROLLS-ROYCE PHANTOM 6.75L V12: Serene satin-smooth turbine whisper ──
    const oscFund = ctx.createOscillator()
    const oscFifth = ctx.createOscillator()
    const oscVelvet = ctx.createOscillator()
    oscFund.type = 'sine'
    oscFifth.type = 'sine'
    oscVelvet.type = 'triangle'

    const base = 92
    oscFund.frequency.setValueAtTime(base, now)
    oscFifth.frequency.setValueAtTime(base * 1.5, now) // Pure fifth warmth
    oscVelvet.frequency.setValueAtTime(base * 2.0, now)

    const velvetGain = ctx.createGain()
    velvetGain.gain.setValueAtTime(0.16, now)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(310, now)
    lp.Q.setValueAtTime(0.8, now)

    const fifthGain = ctx.createGain()
    fifthGain.gain.setValueAtTime(0.45, now)

    // Ultra-subtle satin turbine airflow
    const airSrc = ctx.createBufferSource()
    airSrc.buffer = noiseBuffer
    airSrc.loop = true
    const airLp = ctx.createBiquadFilter()
    airLp.type = 'bandpass'
    airLp.frequency.setValueAtTime(1100, now)
    airLp.Q.setValueAtTime(1.2, now)
    const airGain = ctx.createGain()
    airGain.gain.setValueAtTime(0.02, now)

    oscFund.connect(lp)
    oscFifth.connect(fifthGain)
    fifthGain.connect(lp)
    oscVelvet.connect(velvetGain)
    velvetGain.connect(lp)
    lp.connect(compressor)

    airSrc.connect(airLp)
    airLp.connect(airGain)
    airGain.connect(compressor)

    activeOscs.push(oscFund, oscFifth, oscVelvet)
    activeSources.push(airSrc)

    revHandler = () => {
      const t = ctx.currentTime
      ;[oscFund, oscFifth, oscVelvet].forEach((o, i) => {
        const mult = i === 0 ? 1 : i === 1 ? 1.5 : 2
        o.frequency.cancelScheduledValues(t)
        o.frequency.setValueAtTime(o.frequency.value, t)
        o.frequency.exponentialRampToValueAtTime(base * 1.85 * mult, t + 0.7)
        o.frequency.exponentialRampToValueAtTime(base * mult, t + 2.0)
      })
      lp.frequency.cancelScheduledValues(t)
      lp.frequency.setValueAtTime(lp.frequency.value, t)
      lp.frequency.exponentialRampToValueAtTime(520, t + 0.7)
      lp.frequency.exponentialRampToValueAtTime(310, t + 2.0)
    }

    oscFund.start(now)
    oscFifth.start(now)
    oscVelvet.start(now)
    airSrc.start(now)
    revHandler()
  } else if (engineType === 'v8-twinturbo') {
    // ── ASTON MARTIN DB12: Muscular 4.0L V8 + Turbo Spool + Wastegate Flutter ──
    const oscA = ctx.createOscillator()
    const oscB = ctx.createOscillator()
    const oscSub = ctx.createOscillator()
    const turboWhine = ctx.createOscillator()
    oscA.type = 'sawtooth'
    oscB.type = 'sawtooth'
    oscSub.type = 'triangle'
    turboWhine.type = 'sine'

    const base = 82
    oscA.frequency.setValueAtTime(base, now)
    oscB.frequency.setValueAtTime(base * 1.022, now) // Detuned V8 stereo thickness
    oscSub.frequency.setValueAtTime(base * 1.5, now)
    turboWhine.frequency.setValueAtTime(1650, now)

    const shaper = ctx.createWaveShaper()
    shaper.curve = makeWarmSaturationCurve(0.28)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(480, now)
    lp.Q.setValueAtTime(3.2, now)

    // Real audible cylinder firing LFO (+/- 135 Hz filter sweep!)
    const lfo = ctx.createOscillator()
    lfo.frequency.setValueAtTime(14, now)
    const lfoFilterDepth = ctx.createGain()
    lfoFilterDepth.gain.setValueAtTime(135, now)
    lfo.connect(lfoFilterDepth)
    lfoFilterDepth.connect(lp.frequency)

    const turboGain = ctx.createGain()
    turboGain.gain.setValueAtTime(0.015, now)

    oscA.connect(shaper)
    oscB.connect(shaper)
    oscSub.connect(shaper)
    shaper.connect(lp)
    lp.connect(compressor)

    turboWhine.connect(turboGain)
    turboGain.connect(compressor)

    activeOscs.push(oscA, oscB, oscSub, turboWhine, lfo)

    revHandler = () => {
      const t = ctx.currentTime
      oscA.frequency.cancelScheduledValues(t)
      oscB.frequency.cancelScheduledValues(t)
      oscSub.frequency.cancelScheduledValues(t)
      oscA.frequency.setValueAtTime(oscA.frequency.value, t)
      oscB.frequency.setValueAtTime(oscB.frequency.value, t)
      oscSub.frequency.setValueAtTime(oscSub.frequency.value, t)

      oscA.frequency.exponentialRampToValueAtTime(235, t + 0.42)
      oscA.frequency.exponentialRampToValueAtTime(base, t + 1.45)
      oscB.frequency.exponentialRampToValueAtTime(240, t + 0.42)
      oscB.frequency.exponentialRampToValueAtTime(base * 1.022, t + 1.45)
      oscSub.frequency.exponentialRampToValueAtTime(235 * 1.5, t + 0.42)
      oscSub.frequency.exponentialRampToValueAtTime(base * 1.5, t + 1.45)

      lfo.frequency.setValueAtTime(lfo.frequency.value, t)
      lfo.frequency.linearRampToValueAtTime(32, t + 0.42)
      lfo.frequency.linearRampToValueAtTime(14, t + 1.45)

      lp.frequency.setValueAtTime(lp.frequency.value, t)
      lp.frequency.exponentialRampToValueAtTime(1150, t + 0.42)
      lp.frequency.exponentialRampToValueAtTime(480, t + 1.45)

      // Spool turbo up then bleed with flutter
      turboWhine.frequency.setValueAtTime(1650, t)
      turboWhine.frequency.exponentialRampToValueAtTime(4200, t + 0.42)
      turboWhine.frequency.exponentialRampToValueAtTime(1650, t + 1.1)
      turboGain.gain.setValueAtTime(0.015, t)
      turboGain.gain.linearRampToValueAtTime(0.075, t + 0.4)
      turboGain.gain.linearRampToValueAtTime(0.015, t + 1.1)

      triggerWastegateFlutter(0.46)
    }

    activeOscs.forEach((o) => o.start(now))
    revHandler()
  } else if (engineType === 'v8-hybrid') {
    // ── FERRARI SF90 STRADALE: High-Voltage Triple eMotor + Flat-Plane F154 V8 ──
    const oscFlat1 = ctx.createOscillator()
    const oscFlat2 = ctx.createOscillator()
    const eMotorLo = ctx.createOscillator()
    const eMotorHi = ctx.createOscillator()
    oscFlat1.type = 'sawtooth'
    oscFlat2.type = 'square' // Sharp Italian flat-plane snap
    eMotorLo.type = 'sine'
    eMotorHi.type = 'sine'

    const base = 152
    oscFlat1.frequency.setValueAtTime(base, now)
    oscFlat2.frequency.setValueAtTime(base * 2, now)
    eMotorLo.frequency.setValueAtTime(980, now)
    eMotorHi.frequency.setValueAtTime(1960, now)

    const sqMix = ctx.createGain()
    sqMix.gain.setValueAtTime(0.28, now)

    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(750, now)
    bp.Q.setValueAtTime(2.6, now)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(2200, now)
    lp.Q.setValueAtTime(2.0, now)

    const lfo = ctx.createOscillator()
    lfo.frequency.setValueAtTime(28, now) // Fast flat-plane buzz
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.setValueAtTime(190, now)
    lfo.connect(lfoDepth)
    lfoDepth.connect(bp.frequency)

    const eGain = ctx.createGain()
    eGain.gain.setValueAtTime(0.09, now)

    oscFlat1.connect(bp)
    oscFlat2.connect(sqMix)
    sqMix.connect(bp)
    bp.connect(lp)
    lp.connect(compressor)

    eMotorLo.connect(eGain)
    eMotorHi.connect(eGain)
    eGain.connect(compressor)

    activeOscs.push(oscFlat1, oscFlat2, eMotorLo, eMotorHi, lfo)

    revHandler = () => {
      const t = ctx.currentTime
      // Instant electric surge before F1 flat-plane scream
      eMotorLo.frequency.setValueAtTime(980, t)
      eMotorLo.frequency.exponentialRampToValueAtTime(2600, t + 0.25)
      eMotorLo.frequency.exponentialRampToValueAtTime(1150, t + 1.1)
      eMotorHi.frequency.setValueAtTime(1960, t)
      eMotorHi.frequency.exponentialRampToValueAtTime(4800, t + 0.25)
      eMotorHi.frequency.exponentialRampToValueAtTime(2200, t + 1.1)
      eGain.gain.setValueAtTime(0.09, t)
      eGain.gain.linearRampToValueAtTime(0.15, t + 0.25)
      eGain.gain.linearRampToValueAtTime(0.06, t + 1.1)

      // Sharp Ferrari F154 throttle flare
      oscFlat1.frequency.setValueAtTime(oscFlat1.frequency.value, t)
      oscFlat1.frequency.exponentialRampToValueAtTime(460, t + 0.28)
      oscFlat1.frequency.exponentialRampToValueAtTime(340, t + 0.44) // Quick F1 shift snap!
      oscFlat1.frequency.exponentialRampToValueAtTime(490, t + 0.62)
      oscFlat1.frequency.exponentialRampToValueAtTime(base, t + 1.45)

      oscFlat2.frequency.setValueAtTime(oscFlat2.frequency.value, t)
      oscFlat2.frequency.exponentialRampToValueAtTime(920, t + 0.28)
      oscFlat2.frequency.exponentialRampToValueAtTime(base * 2, t + 1.45)

      bp.frequency.setValueAtTime(bp.frequency.value, t)
      bp.frequency.exponentialRampToValueAtTime(1850, t + 0.28)
      bp.frequency.exponentialRampToValueAtTime(750, t + 1.45)

      lfo.frequency.setValueAtTime(28, t)
      lfo.frequency.linearRampToValueAtTime(64, t + 0.35)
      lfo.frequency.linearRampToValueAtTime(28, t + 1.45)
    }

    activeOscs.forEach((o) => o.start(now))
    revHandler()
  } else if (engineType === 'v8-amg') {
    // ── MERCEDES-AMG G 63: Heavy Cross-Plane Idle Chop + Overrun Exhaust Pops ──
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const oscGrowl = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc2.type = 'sawtooth'
    oscGrowl.type = 'triangle'

    const base = 70
    osc1.frequency.setValueAtTime(base, now)
    osc2.frequency.setValueAtTime(base * 1.498, now) // Guttural fifth
    oscGrowl.frequency.setValueAtTime(base * 2, now)

    const amgShaper = ctx.createWaveShaper()
    amgShaper.curve = makeWarmSaturationCurve(0.65) // Signature Affalterbach grit

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(440, now)
    lp.Q.setValueAtTime(4.2, now)

    // Heavy cross-plane potato-potato amplitude + filter chop at 9.5 Hz!
    const chopLfo = ctx.createOscillator()
    chopLfo.frequency.setValueAtTime(9.5, now)
    const chopFilterGain = ctx.createGain()
    chopFilterGain.gain.setValueAtTime(210, now)
    chopLfo.connect(chopFilterGain)
    chopFilterGain.connect(lp.frequency)

    const amGain = ctx.createGain()
    amGain.gain.setValueAtTime(0.75, now)
    const chopAmpDepth = ctx.createGain()
    chopAmpDepth.gain.setValueAtTime(0.24, now)
    chopLfo.connect(chopAmpDepth)
    chopAmpDepth.connect(amGain.gain)

    const osc2Gain = ctx.createGain()
    osc2Gain.gain.setValueAtTime(0.45, now)

    osc1.connect(amgShaper)
    osc2.connect(osc2Gain)
    osc2Gain.connect(amgShaper)
    oscGrowl.connect(amgShaper)
    amgShaper.connect(lp)
    lp.connect(amGain)
    amGain.connect(compressor)

    activeOscs.push(osc1, osc2, oscGrowl, chopLfo)

    revHandler = () => {
      const t = ctx.currentTime
      osc1.frequency.setValueAtTime(osc1.frequency.value, t)
      osc1.frequency.exponentialRampToValueAtTime(210, t + 0.36)
      osc1.frequency.exponentialRampToValueAtTime(base, t + 1.35)

      osc2.frequency.setValueAtTime(osc2.frequency.value, t)
      osc2.frequency.exponentialRampToValueAtTime(210 * 1.5, t + 0.36)
      osc2.frequency.exponentialRampToValueAtTime(base * 1.498, t + 1.35)

      oscGrowl.frequency.setValueAtTime(oscGrowl.frequency.value, t)
      oscGrowl.frequency.exponentialRampToValueAtTime(420, t + 0.36)
      oscGrowl.frequency.exponentialRampToValueAtTime(base * 2, t + 1.35)

      lp.frequency.setValueAtTime(lp.frequency.value, t)
      lp.frequency.exponentialRampToValueAtTime(1100, t + 0.36)
      lp.frequency.exponentialRampToValueAtTime(440, t + 1.35)

      chopLfo.frequency.setValueAtTime(9.5, t)
      chopLfo.frequency.linearRampToValueAtTime(22, t + 0.36)
      chopLfo.frequency.linearRampToValueAtTime(9.5, t + 1.35)

      // Signature AMG exhaust pops & crackles on throttle lift!
      triggerOverrunPop(0.48, 165, 0.32)
      triggerOverrunPop(0.61, 140, 0.25)
      triggerOverrunPop(0.76, 185, 0.22)
      triggerOverrunPop(0.95, 130, 0.16)
    }

    activeOscs.forEach((o) => o.start(now))
    revHandler()
  } else {
    // ── LAMBORGHINI HURACÁN EVO 5.2L V10: Odd-Order Brassy Italian Trumpet Scream ──
    const oscFund = ctx.createOscillator()
    const oscFifthOrder = ctx.createOscillator()
    const oscHorn = ctx.createOscillator()
    oscFund.type = 'sawtooth'
    oscFifthOrder.type = 'sawtooth'
    oscHorn.type = 'triangle'

    const base = 136
    oscFund.frequency.setValueAtTime(base, now)
    oscFifthOrder.frequency.setValueAtTime(base * 2.5, now) // Unmistakable V10 odd-harmonic ratio!
    oscHorn.frequency.setValueAtTime(base * 5.0, now) // Brassy Sant'Agata horn overtone

    const hornGain = ctx.createGain()
    hornGain.gain.setValueAtTime(0.32, now)
    const fifthGain = ctx.createGain()
    fifthGain.gain.setValueAtTime(0.55, now)

    const formantBp = ctx.createBiquadFilter()
    formantBp.type = 'bandpass'
    formantBp.frequency.setValueAtTime(880, now)
    formantBp.Q.setValueAtTime(3.6, now)

    const warmLp = ctx.createBiquadFilter()
    warmLp.type = 'lowpass'
    warmLp.frequency.setValueAtTime(3200, now)

    const lfo = ctx.createOscillator()
    lfo.frequency.setValueAtTime(36, now) // Tight high-RPM V10 zing
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(160, now)
    lfo.connect(lfoGain)
    lfoGain.connect(formantBp.frequency)

    oscFund.connect(formantBp)
    oscFifthOrder.connect(fifthGain)
    fifthGain.connect(formantBp)
    oscHorn.connect(hornGain)
    hornGain.connect(formantBp)
    formantBp.connect(warmLp)
    warmLp.connect(compressor)

    activeOscs.push(oscFund, oscFifthOrder, oscHorn, lfo)

    revHandler = () => {
      const t = ctx.currentTime
      // Razor-sharp NA V10 8,500 RPM shriek + quick blip
      ;[oscFund, oscFifthOrder, oscHorn].forEach((o, i) => {
        const mult = i === 0 ? 1 : i === 1 ? 2.5 : 5
        o.frequency.cancelScheduledValues(t)
        o.frequency.setValueAtTime(o.frequency.value, t)
        o.frequency.exponentialRampToValueAtTime(410 * mult, t + 0.34)
        o.frequency.exponentialRampToValueAtTime(base * mult, t + 1.35)
      })
      formantBp.frequency.setValueAtTime(formantBp.frequency.value, t)
      formantBp.frequency.exponentialRampToValueAtTime(2400, t + 0.34)
      formantBp.frequency.exponentialRampToValueAtTime(880, t + 1.35)
      lfo.frequency.setValueAtTime(36, t)
      lfo.frequency.linearRampToValueAtTime(82, t + 0.34)
      lfo.frequency.linearRampToValueAtTime(36, t + 1.35)

      triggerOverrunPop(0.45, 240, 0.24)
      triggerOverrunPop(0.58, 210, 0.18)
    }

    activeOscs.forEach((o) => o.start(now))
    revHandler()
  }

  // Smooth fade-in
  masterGain.gain.linearRampToValueAtTime(0.42, now + 0.06)

  const stop = () => {
    if (isStopped) return
    isStopped = true
    try {
      const stopNow = ctx.currentTime
      masterGain.gain.setValueAtTime(masterGain.gain.value, stopNow)
      masterGain.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.22)
      setTimeout(() => {
        try {
          activeOscs.forEach((o) => {
            try {
              o.stop()
              o.disconnect()
            } catch {}
          })
          activeSources.forEach((s) => {
            try {
              s.stop()
              s.disconnect()
            } catch {}
          })
          compressor.disconnect()
          masterGain.disconnect()
        } catch {}
        if (onEnded) onEnded()
      }, 240)
    } catch {}
  }

  return { stop, rev: revHandler }
}
