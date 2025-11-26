<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isMobile = ref(false)

let cleanup: (() => void) | null = null

onMounted(async () => {
  const isTouch = 'ontouchstart' in window || window.innerWidth < 1024
  if (isTouch) {
    isMobile.value = true
    return
  }

  await nextTick()

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  let mouseX = 0
  let mouseY = 0
  let circleX = 0
  let circleY = 0

  // Click effect state
  let rippleRadius = 0
  let rippleOpacity = 0
  let rippleX = 0
  let rippleY = 0
  let isRippling = false

  // Hover state
  let isHovering = false
  let isInactive = true
  let cursorOpacity = 0
  let inactivityTimer: ReturnType<typeof setTimeout> | null = null

  // Animation loop control
  let animationId: number | null = null
  let isTabVisible = true

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
    isInactive = false

    // Reset inactivity timer
    if (inactivityTimer) clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(() => {
      isInactive = true
    }, 200)

    // Check if hovering over clickable elements
    const target = e.target as HTMLElement
    isHovering = !!(
      target.closest('a')
      || target.closest('button')
      || target.closest('[role="button"]')
      || target.closest('input')
      || target.closest('textarea')
    )

    // Restart animation loop if it was stopped
    ensureAnimating()
  }
  window.addEventListener('mousemove', onMouseMove)

  const onMouseDown = () => {
    rippleX = circleX
    rippleY = circleY
    rippleRadius = 5
    rippleOpacity = 0.4
    isRippling = true
    ensureAnimating()
  }
  window.addEventListener('mousedown', onMouseDown)

  const isIdle = () => {
    // Cursor has converged to mouse position and is fully transparent
    const settled = Math.abs(mouseX - circleX) < 0.5 && Math.abs(mouseY - circleY) < 0.5
    return settled && cursorOpacity < 0.01 && !isRippling
  }

  const ensureAnimating = () => {
    if (!animationId && isTabVisible) {
      animationId = requestAnimationFrame(animate)
    }
  }

  const stopAnimating = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  const animate = () => {
    // Ease circle towards mouse position
    const ease = 0.075
    circleX += (mouseX - circleX) * ease
    circleY += (mouseY - circleY) * ease

    // Fade cursor opacity based on hover and inactivity state
    const targetOpacity = (isHovering || isInactive) ? 0 : 0.2
    cursorOpacity += (targetOpacity - cursorOpacity) * 0.03

    // Only touch canvas if there's something to draw
    const hasContent = cursorOpacity > 0.01 || isRippling
    if (hasContent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ripple effect on click
      if (isRippling) {
        rippleRadius += 1.5
        rippleOpacity -= 0.02

        if (rippleOpacity > 0) {
          ctx.beginPath()
          ctx.arc(rippleX, rippleY, rippleRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${rippleOpacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        else {
          isRippling = false
        }
      }

      // Draw main circle
      if (cursorOpacity > 0.01) {
        ctx.beginPath()
        ctx.arc(circleX, circleY, 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${cursorOpacity * 0.5})`
        ctx.strokeStyle = `rgba(255, 255, 255, ${cursorOpacity})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    // Stop looping if fully idle — will be restarted by mousemove/mousedown
    if (isIdle()) {
      // One final clear to remove any remnants
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      animationId = null
      return
    }

    animationId = requestAnimationFrame(animate)
  }

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden
    if (isTabVisible) {
      ensureAnimating()
    }
    else {
      stopAnimating()
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  // Start initial loop
  ensureAnimating()

  cleanup = () => {
    stopAnimating()
    if (inactivityTimer) clearTimeout(inactivityTimer)
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <canvas
    v-if="!isMobile"
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-50"
  />
</template>
