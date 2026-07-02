export function computeRecommendation(detection, frameHeight, options) {
  const setpointYPx = Math.round(frameHeight * options.setpointYNorm)

  if (!detection.tracking) {
    return {
      setpointYPx,
      errorYPx: null,
      recommendation: null,
    }
  }

  const errorYPx = detection.bottomYPx - setpointYPx
  if (Math.abs(errorYPx) <= options.deadbandPx) {
    return {
      setpointYPx,
      errorYPx,
      recommendation: null,
    }
  }

  const unclampedVelocity =
    options.controlSign * options.kpMmSPerPx * errorYPx
  const velocityMmS = clamp(
    unclampedVelocity,
    -options.maxVelocityMmS,
    options.maxVelocityMmS,
  )

  return {
    setpointYPx,
    errorYPx,
    recommendation: {
      mode: "velocity_mm_s",
      velocity_mm_s: round(velocityMmS, 4),
    },
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function round(value, digits) {
  const scale = 10 ** digits
  return Math.round(value * scale) / scale
}
