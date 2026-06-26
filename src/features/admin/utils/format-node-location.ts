import { InstalledLocation } from '../types/node.types'

export type NodeLocationValue = string | InstalledLocation | null | undefined

export function formatNodeLocation(
	location: NodeLocationValue,
	locationTitle?: string | null,
	fallback = 'Position N/A',
) {
	if (locationTitle?.trim()) return locationTitle
	if (!location) return fallback
	if (typeof location === 'string') return location || fallback

	const { planImageIndex, xPercent, yPercent } = location
	const hasCoordinates =
		typeof xPercent === 'number' && typeof yPercent === 'number'

	if (!hasCoordinates) return fallback

	const planNumber =
		typeof planImageIndex === 'number' ? planImageIndex + 1 : null
	const coordinateLabel = `${xPercent.toFixed(1)}%, ${yPercent.toFixed(1)}%`

	return planNumber ? `Plan ${planNumber} (${coordinateLabel})` : coordinateLabel
}
