import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

function HydraModelViewer({ src, alt }) {
  const wrapRef = useRef(null)
  const [loadModel, setLoadModel] = useState(false)

  useEffect(() => {
    const root = wrapRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setLoadModel(true)
          io.disconnect()
        }
      },
      { rootMargin: '150px' },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="hydra-model-viewer-wrap">
      {loadModel ? (
        <model-viewer
          src={src}
          alt={alt}
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="18deg"
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
          className="hydra-model-viewer"
        />
      ) : (
        <div className="hydra-model-placeholder" aria-hidden />
      )}
    </div>
  )
}

export default HydraModelViewer
