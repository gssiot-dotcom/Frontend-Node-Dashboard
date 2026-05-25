/**
 * GSS IoT Constants
 * Status/color mapping and threshold configuration.
 * Adjust thresholds here when calibrating with real hardware.
 */

// Tilt thresholds (degrees)
export const TILT_THRESHOLDS = {
	SLIGHT: 5, // 5° = slight tilt
	STRONG: 15, // 15° = strong tilt / danger
}

// Boot sentinel — ignore this packet pattern on startup
export const BOOT_SENTINEL = { x: 0, y: 12.5 }

// Alert level → UI mapping
export const ALERT_UI_MAP = {
	safe: {
		cardBg: 'bg-card border-gss-safe/20',
		glowClass: 'glow-primary',
		badgeColor: 'bg-gss-safe/15 text-gss-safe border-gss-safe/30',
		statusLabel: 'verticalNodes.filterButtons.normal',
		ledColor: '#0ea5e9', // cyan-500
	},
	warning: {
		cardBg: 'bg-card border-gss-warning/30',
		glowClass: 'glow-warning',
		badgeColor: 'bg-gss-warning/15 text-gss-warning border-gss-warning/30',
		statusLabel: 'verticalNodes.filterButtons.warning',
		ledColor: '#eab308', // yellow-500
	},
	danger: {
		cardBg: 'bg-card border-gss-danger/30',
		glowClass: 'glow-danger',
		badgeColor: 'bg-gss-danger/15 text-gss-danger border-gss-danger/30',
		statusLabel: 'verticalNodes.filterButtons.danger',
		ledColor: '#ef4444', // red-500
	},
	offline: {
		cardBg: 'bg-card border-gss-offline/20',
		glowClass: '',
		badgeColor: 'bg-gss-offline/15 text-gss-offline border-gss-offline/30',
		statusLabel: 'verticalNodes.filterButtons.offline',
		ledColor: '#64748b', // slate-500
	},
}

// LED position indices for the T-shape (0=center, then directional)
export const LED_POSITIONS = {
	center: { label: 'Center', index: 0 },
	left: { label: 'Left', index: 1 },
	right: { label: 'Right', index: 2 },
	up: { label: 'Up', index: 3 },
	down: { label: 'Down', index: 4 },
}

// Node type metadata for dashboard cards
export const NODE_TYPE_META = {
	'vertical-node': {
		labelKey: 'dashboard.nodeTypes.verticalNode.title',
		descriptionKey: 'dashboard.nodeTypes.verticalNode.description',
		icon: 'Activity',
		active: true,
		route: '/dashboard/vertical-node',
	},
	gateway: {
		labelKey: 'dashboard.nodeTypes.gateway.title',
		descriptionKey: 'dashboard.nodeTypes.gateway.description',
		icon: 'Router',
		active: false,
		route: null,
	},
	sensor: {
		labelKey: 'dashboard.nodeTypes.sensor.title',
		descriptionKey: 'dashboard.nodeTypes.sensor.description',
		icon: 'Thermometer',
		active: false,
		route: null,
	},
}
