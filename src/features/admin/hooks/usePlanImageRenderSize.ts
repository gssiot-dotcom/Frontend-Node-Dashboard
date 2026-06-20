import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type RenderSize = {
	width: number
	height: number
}

type UsePlanImageRenderSizeOptions = {
	allowUpscale?: boolean
}

export function usePlanImageRenderSize(
	containerRef: RefObject<HTMLElement>,
	imageSrc: string | undefined,
	options: UsePlanImageRenderSizeOptions = {},
) {
	const { allowUpscale = false } = options
	const [renderSize, setRenderSize] = useState<RenderSize | null>(null)
	const naturalSize = useRef<RenderSize | null>(null)

	const recalculate = useCallback(() => {
		const container = containerRef.current
		const natural = naturalSize.current

		if (!container || !natural) return

		const rect = container.getBoundingClientRect()
		const containerWidth = rect.width
		const containerHeight = rect.height

		if (containerWidth <= 0 || containerHeight <= 0) return

		const maxScale = allowUpscale ? Number.POSITIVE_INFINITY : 1
		const scale = Math.min(
			containerWidth / natural.width,
			containerHeight / natural.height,
			maxScale,
		)

		setRenderSize({
			width: Math.round(natural.width * scale),
			height: Math.round(natural.height * scale),
		})
	}, [allowUpscale, containerRef])

	useEffect(() => {
		if (!imageSrc) {
			naturalSize.current = null
			setRenderSize(null)
			return
		}

		let cancelled = false
		const image = new Image()

		image.onload = () => {
			if (cancelled) return

			naturalSize.current = {
				width: image.naturalWidth,
				height: image.naturalHeight,
			}
			recalculate()
		}

		image.onerror = () => {
			if (cancelled) return
			naturalSize.current = null
			setRenderSize(null)
		}

		setRenderSize(null)
		image.src = imageSrc

		return () => {
			cancelled = true
		}
	}, [imageSrc, recalculate])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const resizeObserver = new ResizeObserver(recalculate)
		resizeObserver.observe(container)

		return () => resizeObserver.disconnect()
	}, [containerRef, recalculate])

	return renderSize
}
