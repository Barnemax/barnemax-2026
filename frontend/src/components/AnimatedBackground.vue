<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: string
  rings?: number
}>(), {
  color: 'rgba(255, 255, 255, 0.08)',
  rings: 8,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let canvasCtx = null as CanvasRenderingContext2D | null
let animationId: number | null = null
let lastFrame = 0
const frameInterval = 1000 / 30 // 30fps cap
let isActive = true
const isReady = ref(false)
const isLeaving = ref(false)

// Hide canvas when navigating away
onBeforeRouteLeave(() => {
  isLeaving.value = true
  isReady.value = false
})

// Glow state - all rings glow with random brightness
const isGlowing = ref(false)
const glowIntensityValue = ref(0)
const ringBrightness = ref<number[]>([]) // Random multiplier per ring
let glowTimer: number | null = null

// Smooth easing function (ease-in-out cubic)
const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}

// Heartbeat pulse function - creates smooth lub-dub pattern
const heartbeat = (t: number, ringIndex: number, totalRings: number): number => {
  const cycle = 10
  const staggerDelay = (ringIndex / totalRings) * 0.4
  const phase = ((t - staggerDelay * cycle) % cycle + cycle) % cycle / cycle

  // Smoother, longer transitions
  if (phase < 0.12) {
    // First beat (lub) - smooth rise and fall
    const p = phase / 0.12
    const curve = p < 0.5 ? easeInOutCubic(p * 2) : easeInOutCubic((1 - p) * 2)
    return curve * 0.8
  }
  else if (phase < 0.18) {
    // Brief pause between beats
    return 0
  }
  else if (phase < 0.3) {
    // Second beat (dub) - smooth and slightly smaller
    const p = (phase - 0.18) / 0.12
    const curve = p < 0.5 ? easeInOutCubic(p * 2) : easeInOutCubic((1 - p) * 2)
    return curve * 0.5
  }
  // Rest of cycle
  return 0
}

// Glow fade state (driven by main loop instead of separate rAF)
let glowFadeStart = 0
const glowFadeDuration = 3000

const scheduleNextGlow = () => {
  const delay = 4000 + Math.random() * 4000 // 4-8 seconds between glows
  glowTimer = window.setTimeout(() => {
    // Generate random brightness for each ring (0.3 to 1.0)
    ringBrightness.value = Array.from({ length: props.rings }, () => 0.3 + Math.random() * 0.7)
    isGlowing.value = true
    glowFadeStart = performance.now()
  }, delay)
}

const draw = (timestamp: number) => {
  const canvas = canvasRef.value
  if (!canvas || !canvasCtx) return

  // Update glow fade from main loop (replaces separate rAF)
  if (isGlowing.value) {
    const elapsed = timestamp - glowFadeStart
    const progress = Math.min(elapsed / glowFadeDuration, 1)
    glowIntensityValue.value = Math.sin(progress * Math.PI)
    if (progress >= 1) {
      isGlowing.value = false
      glowIntensityValue.value = 0
      scheduleNextGlow()
    }
  }

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const maxRadius = Math.max(canvas.width, canvas.height) * 0.45
  const time = timestamp / 1000

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < props.rings; i++) {
    const baseRadius = ((i + 1) / props.rings) * maxRadius
    // Calculate pulse per ring with stagger effect
    const pulse = heartbeat(time, i, props.rings)
    const pulseScale = 1 + pulse * 0.015
    const radius = baseRadius * pulseScale
    const glowIntensity = isGlowing.value ? glowIntensityValue.value * (ringBrightness.value[i] || 0.5) : 0

    canvasCtx.beginPath()
    canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)

    // Opacity-based glow (no blur for performance)
    const opacity = 0.08 + 0.15 * glowIntensity
    canvasCtx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
    canvasCtx.lineWidth = 1

    canvasCtx.stroke()
  }
}

const animate = (timestamp: number) => {
  if (!isActive) return

  if (timestamp - lastFrame < frameInterval) {
    animationId = requestAnimationFrame(animate)
    return
  }
  lastFrame = timestamp

  if (isReady.value) {
    draw(timestamp)
  }
  animationId = requestAnimationFrame(animate)
}

const stopAnimation = () => {
  isActive = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (glowTimer) clearTimeout(glowTimer)
}

const startAnimation = () => {
  if (isActive) return
  isActive = true
  scheduleNextGlow()
  animationId = requestAnimationFrame(animate)
}

const onVisibilityChange = () => {
  if (document.hidden) {
    stopAnimation()
  }
  else {
    startAnimation()
  }
}

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas || !isReady.value) return

  const rect = canvas.getBoundingClientRect()
  if (rect.width > 0 && rect.height > 0) {
    canvas.width = rect.width
    canvas.height = rect.height
    canvasCtx = canvas.getContext('2d')
    draw(performance.now())
  }
}

onMounted(() => {
  // Delay initialization until after page transition
  setTimeout(() => {
    isReady.value = true
    resize()
    scheduleNextGlow()
  }, 350)

  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibilityChange)

  // Cache context
  const canvas = canvasRef.value
  if (canvas) {
    canvasCtx = canvas.getContext('2d')
  }
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  stopAnimation()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full transition-opacity ease-in pointer-events-none"
    :class="[isReady ? 'opacity-75' : 'opacity-0', isLeaving ? 'duration-100' : 'duration-800']"
  />
</template>
