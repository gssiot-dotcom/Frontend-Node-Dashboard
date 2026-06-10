type NodeStatus = 'safe' | 'caution' | 'warning' | 'danger' | 'offline'
type LedPosition = 'center' | 'up' | 'down' | 'left' | 'right'

interface TiltUiState {
	alertLevel: NodeStatus
	activeLedPosition: LedPosition
	ledColor: string
	cardBgClass: string
	glowClass: string
	badgeColor: string
	statusLabel: string
}

export function mapTiltToUiState(
	angleX: number,
	angleY: number,
	isOnline: boolean,
	nodeStatus: NodeStatus,
): TiltUiState {
	if (!isOnline || nodeStatus === 'offline') {
		return {
			alertLevel: 'offline',
			activeLedPosition: 'center',
			ledColor: 'hsl(var(--gss-offline))',
			cardBgClass: 'bg-card border-border/50',
			glowClass: '',
			badgeColor: 'bg-muted/50 text-muted-foreground border-border/50',
			statusLabel: 'Offline',
		}
	}

	const absX = Math.abs(angleX)
	const absY = Math.abs(angleY)

	let activeLedPosition: LedPosition = 'center'

	if (absY > absX) {
		activeLedPosition = angleY > 0 ? 'up' : 'down'
	} else if (absX > absY) {
		activeLedPosition = angleX > 0 ? 'right' : 'left'
	} else if (absX !== 0 || absY !== 0) {
		activeLedPosition = angleY >= 0 ? 'up' : 'down'
	}

	const uiByStatus = {
		safe: {
			ledColor: 'hsl(var(--gss-safe))',
			cardBgClass: 'bg-card border-gss-safe/20',
			glowClass: 'glow-primary',
			badgeColor: 'bg-gss-safe/10 text-gss-safe border-gss-safe/30',
			statusLabel: 'Stable',
		},
		caution: {
			ledColor: 'hsl(var(--gss-caution))',
			cardBgClass: 'bg-card border-gss-caution/20',
			glowClass: 'glow-caution',
			badgeColor: 'bg-gss-caution/10 text-gss-caution border-gss-caution/30',
			statusLabel: 'Caution',
		},
		warning: {
			ledColor: 'hsl(var(--gss-warning))',
			cardBgClass: 'bg-card border-gss-warning/20',
			glowClass: 'glow-warning',
			badgeColor: 'bg-gss-warning/10 text-gss-warning border-gss-warning/30',
			statusLabel: 'Warning',
		},
		danger: {
			ledColor: 'hsl(var(--gss-danger))',
			cardBgClass: 'bg-card border-gss-danger/30',
			glowClass: 'glow-danger',
			badgeColor: 'bg-gss-danger/10 text-gss-danger border-gss-danger/30',
			statusLabel: 'Danger',
		},
	} as const

	return {
		alertLevel: nodeStatus,
		activeLedPosition,
		...uiByStatus[nodeStatus],
	}
}
