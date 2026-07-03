export function computePRecommendation(detection, frameHeight, options) {
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

export function computePIRecommendation(
  detection,
  frameHeight,
  options,
  controllerState,
  nowMs,
) {
  const setpointYPx = Math.round(frameHeight * options.setpointYNorm)

  if (!detection.tracking) {
    return {
      setpointYPx,
      errorYPx: null,
      recommendation: null,
      controllerState: resetControllerState(),
    }
  }

  const errorYPx = detection.bottomYPx - setpointYPx
  if (Math.abs(errorYPx) <= options.deadbandPx) {
    return {
      setpointYPx,
      errorYPx,
      recommendation: null,
      controllerState: resetControllerState(nowMs),
    }
  }

  const dtS =
    controllerState.lastUpdateMs !== null
      ? clamp((nowMs - controllerState.lastUpdateMs) / 1000, 0, 0.25)
      : 0

  const nextIntegralErrorPxS = clamp(
    controllerState.integralErrorPxS + errorYPx * dtS,
    -options.maxIntegralErrorPxS,
    options.maxIntegralErrorPxS,
  )

  const unclampedVelocity =
    options.controlSign *
    (options.kpMmSPerPx * errorYPx +
      options.kiMmSPerPxS * nextIntegralErrorPxS)
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
    controllerState: {
      integralErrorPxS: nextIntegralErrorPxS,
      lastUpdateMs: nowMs,
    },
  }
}

export function resetControllerState(lastUpdateMs = null) {
  return {
    integralErrorPxS: 0,
    lastUpdateMs,
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function round(value, digits) {
  const scale = 10 ** digits
  return Math.round(value * scale) / scale
}
