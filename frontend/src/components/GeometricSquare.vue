<script setup lang="ts">
const props = withDefaults(defineProps<{
  seed?: number
  size?: number | 'auto'
}>(), {
  seed: 42,
  size: 'auto',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let canvasCtx = null as CanvasRenderingContext2D | null
let animationSeed = props.seed

const draw = () => {
  const canvas = canvasRef.value
  if (!canvas || !canvasCtx) {
    return
  }

  const s = canvas.width
  if (s === 0) {
    return
  }

  const cellSize = s / 3
  const r = cellSize * 0.2

  canvasCtx.clearRect(0, 0, s, s)

  canvasCtx.fillStyle = getComputedStyle(canvas).color

  for (let i = 0; i < 9; i++) {
    const hash = (animationSeed * (i + 1) * 31 + props.seed * 7) % 100
    if (hash > 40) {
      canvasCtx.beginPath()
      canvasCtx.arc((i % 3) * cellSize + cellSize / 2, Math.floor(i / 3) * cellSize + cellSize / 2, r, 0, Math.PI * 2)
      canvasCtx.fill()
    }
  }
}

// Use shared animation timer
const { elementRef } = useAnimationTick(() => {
  animationSeed++
  draw()
}, 350)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  // Size canvas to match element
  const rect = canvas.getBoundingClientRect()
  const s = Math.round(Math.min(rect.width, rect.height))
  canvas.width = s
  canvas.height = s
  canvasCtx = canvas.getContext('2d')

  draw()
})
</script>

<template>
  <span
    ref="elementRef"
    class="inline-flex items-center justify-center aspect-square"
    :class="size === 'auto' ? 'h-[1em]' : ''"
    :style="size !== 'auto' ? { width: `${size}px`, height: `${size}px` } : undefined"
  >
    <canvas
      ref="canvasRef"
      class="w-full h-full"
    />
  </span>
</template>
