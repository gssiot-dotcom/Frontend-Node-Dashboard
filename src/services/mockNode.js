/**
 * Mock Node Data
 *
 * Generates fake vertical-node data for UI development.
 * Replace with real API calls when connecting to backend.
 */

const LOCATIONS = [
	'Seoul HQ',
	'Busan Plant',
	'Incheon Port',
	'Daejeon Lab',
	'Gwangju Station',
	'Jeju Site',
]
const GROUPS = ['Group A', 'Group B', 'Group C']

function randomBetween(min, max) {
	return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function generateNode(index) {
	const id = `VN-${String(index + 1).padStart(3, '0')}`
	const isOnline = Math.random() > 0.12 // ~88% online
	const hasWarning = Math.random() > 0.6
	const hasDanger = Math.random() > 0.85

	let x = 0,
		y = 0
	if (isOnline) {
		if (hasDanger) {
			x = randomBetween(-25, 25)
			y = randomBetween(-25, 25)
		} else if (hasWarning) {
			x = randomBetween(-12, 12)
			y = randomBetween(-12, 12)
		} else {
			x = randomBetween(-3, 3)
			y = randomBetween(-3, 3)
		}
	}

	return {
		id,
		name: `Node ${index + 1}`,
		type: 'vertical-node',
		x,
		y,
		status: isOnline ? 'active' : 'inactive',
		isOnline,
		battery: isOnline ? Math.floor(Math.random() * 60 + 40) : 0,
		lastSeen: isOnline
			? new Date(Date.now() - Math.random() * 60000).toISOString()
			: new Date(Date.now() - Math.random() * 3600000 * 24).toISOString(),
		alertLevel: 'safe', // Will be computed by tiltMapper
		activeLed: 'center',
		group: GROUPS[Math.floor(Math.random() * GROUPS.length)],
		location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
	}
}

let cachedNodes = null

export function generateMockNodes(count = 24) {
	if (!cachedNodes) {
		cachedNodes = Array.from({ length: count }, (_, i) => generateNode(i))
	}
	return cachedNodes
}

export function resetMockNodes() {
	cachedNodes = null
}

/**
 * Simulates fetching nodes from an API.
 * Replace with: fetch('/api/nodes/vertical')
 */
export async function fetchVerticalNodes() {
	await new Promise(r => setTimeout(r, 600))
	return generateMockNodes(24)
}
