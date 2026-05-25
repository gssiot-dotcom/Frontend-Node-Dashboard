/**
 * Pure function: Maps incoming x/y tilt data into UI state.
 *
 * This is the core business logic for the vertical-node visualization.
 * Replace thresholds and logic here to match real hardware calibration.
 *
 * @param {number} x - X-axis tilt in degrees
 * @param {number} y - Y-axis tilt in degrees
 * @param {boolean} isOnline - Whether the node is online
 * @returns {import('./types').VerticalNodeUiState}
 */

import { ALERT_UI_MAP, TILT_THRESHOLDS } from './constants'

export function mapTiltToUiState(x, y, isOnline) {
	if (!isOnline) {
		return {
			direction: 'offline',
			alertLevel: 'offline',
			activeLedPosition: 'none',
			cardBgClass: ALERT_UI_MAP.offline.cardBg,
			badgeColor: ALERT_UI_MAP.offline.badgeColor,
			statusLabel: ALERT_UI_MAP.offline.statusLabel,
			glowClass: ALERT_UI_MAP.offline.glowClass,
			ledColor: ALERT_UI_MAP.offline.ledColor,
		}
	}

	const absX = Math.abs(x)
	const absY = Math.abs(y)
	const maxTilt = Math.max(absX, absY)

	// Determine alert level from max tilt magnitude
	let alertLevel = 'safe'
	if (maxTilt >= TILT_THRESHOLDS.STRONG) {
		alertLevel = 'danger'
	} else if (maxTilt >= TILT_THRESHOLDS.SLIGHT) {
		alertLevel = 'warning'
	}

	// Determine dominant direction
	let direction = 'neutral'
	let activeLedPosition = 'center'

	if (maxTilt >= TILT_THRESHOLDS.SLIGHT) {
		if (absX >= absY) {
			// X-axis dominant
			if (x > 0) {
				direction =
					maxTilt >= TILT_THRESHOLDS.STRONG ? 'strong-right' : 'slight-right'
				activeLedPosition = 'right'
			} else {
				direction =
					maxTilt >= TILT_THRESHOLDS.STRONG ? 'strong-left' : 'slight-left'
				activeLedPosition = 'left'
			}
		} else {
			// Y-axis dominant
			if (y > 0) {
				direction =
					maxTilt >= TILT_THRESHOLDS.STRONG ? 'strong-up' : 'slight-up'
				activeLedPosition = 'up'
			} else {
				direction =
					maxTilt >= TILT_THRESHOLDS.STRONG ? 'strong-down' : 'slight-down'
				activeLedPosition = 'down'
			}
		}
	}

	const uiMap = ALERT_UI_MAP[alertLevel]

	return {
		direction,
		alertLevel,
		activeLedPosition,
		cardBgClass: uiMap.cardBg,
		badgeColor: uiMap.badgeColor,
		statusLabel: uiMap.statusLabel,
		glowClass: uiMap.glowClass,
		ledColor: uiMap.ledColor,
	}
}

/**
 * Returns a normalized tilt intensity from 0 to 1 for animation purposes.
 */
export function getTiltIntensity(x, y) {
	const magnitude = Math.sqrt(x * x + y * y)
	return Math.min(magnitude / 30, 1)
}
