type TickCallback = () => void

/**
 * Shared animation timer using setInterval instead of requestAnimationFrame.
 * rAF runs at 60+ fps even when callbacks only fire every 350ms — wasteful
 * for infrequent updates and competes with other GPU work (e.g. video decoding).
 *
 * setInterval only wakes the browser at the actual interval rate.
 * Automatically pauses when the tab is hidden or the element is off-screen.
 *
 * @param callback - Function to call on each tick
 * @param interval - Milliseconds between ticks (default 300)
 */
export function useAnimationTick(callback: TickCallback, interval = 300) {
  const isInViewport = ref(true)
  const elementRef = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null
  let intervalId: ReturnType<typeof setInterval> | null = null

  const start = () => {
    if (intervalId) return
    intervalId = setInterval(() => {
      if (isInViewport.value) {
        callback()
      }
    }, interval)
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop()
    }
    else {
      start()
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        isInViewport.value = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0 },
    )

    if (elementRef.value) {
      observer.observe(elementRef.value)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    start()
  })

  onUnmounted(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    observer?.disconnect()
  })

  const observe = (el: HTMLElement | null) => {
    if (el && observer) {
      observer.disconnect()
      observer.observe(el)
    }
  }

  return {
    elementRef,
    isInViewport,
    observe,
  }
}
