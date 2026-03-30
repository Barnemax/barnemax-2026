<script setup lang="ts">
/**
 * GeometricText - Text that transforms into an animated dot grid
 *
 * Behavior:
 * - Shows normal text by default
 * - On hover: text fades out, animated dot grid fades in
 * - Every 10s: briefly shows dot animation for 2s (only when visible on screen)
 * - Dots scramble every 400ms while visible
 *
 * Uses canvas instead of SVG to avoid Vue diffing hundreds of DOM nodes.
 */

const props = defineProps<{
  text: string
}>()

// =============================================================================
// STATE
// =============================================================================

const isHovering = ref(false)
const showDots = ref(false)
const isVisible = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let canvasCtx = null as CanvasRenderingContext2D | null

const dotsVisible = computed(() => showDots.value || isHovering.value)

// =============================================================================
// CANVAS DOT RENDERING
// =============================================================================

let animationSeed = 0

const drawDots = () => {
  const canvas = canvasRef.value
  if (!canvas || !canvasCtx) {
    return
  }

  // Sync canvas pixel size with display size
  const rect = canvas.getBoundingClientRect()
  const w = Math.round(rect.width)
  const h = Math.round(rect.height)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }

  canvasCtx.clearRect(0, 0, w, h)

  const cols = props.text.length * 3
  const rows = 3
  // Use square cells (same as SVG preserveAspectRatio="xMidYMid meet")
  const cellSize = Math.min(w / cols, h / rows)
  const gridW = cols * cellSize
  const gridH = rows * cellSize
  const offsetX = (w - gridW) / 2
  const offsetY = (h - gridH) / 2
  const r = cellSize * 0.16

  canvasCtx.fillStyle = getComputedStyle(canvas).color

  for (let charIdx = 0; charIdx < props.text.length; charIdx++) {
    const char = props.text[charIdx] || ''
    const charSeed = char.charCodeAt(0) + charIdx * 7 + animationSeed * 13

    for (let i = 0; i < 9; i++) {
      const hash = (charSeed * (i + 1) * 31) % 100
      if (hash > 40) {
        const col = charIdx * 3 + (i % 3)
        const row = Math.floor(i / 3)

        canvasCtx.beginPath()
        canvasCtx.arc(offsetX + col * cellSize + cellSize / 2, offsetY + row * cellSize + cellSize / 2, r, 0, Math.PI * 2)
        canvasCtx.fill()
      }
    }
  }
}

// =============================================================================
// ANIMATION TIMING
// =============================================================================

const { elementRef } = useAnimationTick(() => {
  if (dotsVisible.value) {
    animationSeed++
    drawDots()
  }
}, 400)

// Draw immediately when dots become visible (don't wait for next 400ms tick)
watch(dotsVisible, (visible) => {
  if (visible) {
    drawDots()
  }
})

// =============================================================================
// PERIODIC ANIMATION (every 10s, show dots for 2s)
// =============================================================================

let intervalId: ReturnType<typeof setInterval> | null = null

const startInterval = () => {
  if (intervalId) {
    return
  }
  intervalId = setInterval(() => {
    showDots.value = true
    setTimeout(() => {
      showDots.value = false
    }, 2000)
  }, 10000)
}

const stopInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  showDots.value = false
}

// =============================================================================
// VISIBILITY OBSERVER (only animate when on screen)
// =============================================================================

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (canvasRef.value) {
    canvasCtx = canvasRef.value.getContext('2d')
  }

  observer = new IntersectionObserver(
    (entries) => {
      isVisible.value = entries[0]?.isIntersecting ?? false
      if (isVisible.value) {
        startInterval()
      } else {
        stopInterval()
      }
    },
    { threshold: 0.1 },
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  stopInterval()
  observer?.disconnect()
})
</script>

<template>
  <span
    ref="elementRef"
    class="relative inline-block cursor-pointer"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Normal text (hidden when dots are visible) -->
    <span
      class="transition-all duration-500"
      :class="dotsVisible ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
    >
      {{ text }}
    </span>

    <!-- Canvas dot grid overlay (shown on hover or periodic animation) -->
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="absolute inset-0 w-full h-full transition-all duration-500"
      :class="dotsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'"
    />
  </span>
</template>
