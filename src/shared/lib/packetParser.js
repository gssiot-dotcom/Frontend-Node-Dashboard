/**
 * Packet Parser / Transform Layer
 *
 * Isolates all incoming data transformation from components.
 * When connecting to a real socket/API, modify parseNodePacket
 * to handle the actual wire format.
 *
 * IMPORTANT: Contains sentinel detection logic.
 * The boot sentinel (x=0, y=12.5) is a startup artifact
 * that must be filtered before UI state is computed.
 */

import { BOOT_SENTINEL } from './constants'

/**
 * Checks if a packet is a boot sentinel that should be ignored.
 * @param {import('./types').VerticalNodePacket} packet
 * @returns {boolean}
 */
export function isBootSentinel(packet) {
	return packet.x === BOOT_SENTINEL.x && packet.y === BOOT_SENTINEL.y
}

/**
 * Parses raw socket data into a VerticalNodePacket.
 * Replace this with real wire-format parsing when connecting to actual socket.
 *
 * @param {any} rawData - Raw data from socket
 * @returns {import('./types').VerticalNodePacket|null}
 */
export function parseNodePacket(rawData) {
	// For mock: rawData is already structured
	// For real: parse binary/JSON wire format here
	if (!rawData || typeof rawData.nodeId !== 'string') {
		return null
	}

	return {
		nodeId: rawData.nodeId,
		x: Number(rawData.x) || 0,
		y: Number(rawData.y) || 0,
		timestamp: rawData.timestamp || Date.now(),
		isBoot: rawData.isBoot || false,
	}
}

/**
 * Validates and transforms a packet, filtering sentinels.
 * @param {any} rawData
 * @returns {{ valid: boolean, packet: import('./types').VerticalNodePacket|null, reason?: string }}
 */
export function processIncomingPacket(rawData) {
	const packet = parseNodePacket(rawData)

	if (!packet) {
		return { valid: false, packet: null, reason: 'parse_error' }
	}

	if (isBootSentinel(packet)) {
		return { valid: false, packet, reason: 'boot_sentinel' }
	}

	return { valid: true, packet }
}
