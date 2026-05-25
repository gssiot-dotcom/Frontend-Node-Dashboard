/**
 * Mock Socket Service
 *
 * Simulates real-time WebSocket/Socket.io connection for node updates.
 *
 * TO REPLACE WITH REAL SOCKET:
 * 1. Import your socket.io-client or native WebSocket
 * 2. Replace MockSocketService methods with real connection logic
 * 3. Keep the same event interface (onNodeUpdate, onConnect, etc.)
 * 4. The rest of the app will work without changes
 *
 * The service emits node update events with the same packet format
 * that the real server will send.
 */

import { generateMockNodes } from './mockNode'

class MockSocketService {
	constructor() {
		this.listeners = new Map()
		this.interval = null
		this.connected = false
		this.nodes = []
	}

	/**
	 * Connect to the mock socket.
	 * Replace with: io('wss://your-server.com') or new WebSocket(...)
	 */
	connect() {
		if (this.connected) return
		this.connected = true
		this.nodes = generateMockNodes(24)
		this._emit('connect', { status: 'connected' })
		this._startEmitting()
	}

	disconnect() {
		this.connected = false
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = null
		}
		this._emit('disconnect', { status: 'disconnected' })
	}

	/**
	 * Register an event listener.
	 * @param {'node_update'|'connect'|'disconnect'} event
	 * @param {Function} callback
	 * @returns {Function} unsubscribe function
	 */
	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set())
		}
		this.listeners.get(event).add(callback)
		return () => this.listeners.get(event)?.delete(callback)
	}

	off(event, callback) {
		this.listeners.get(event)?.delete(callback)
	}

	_emit(event, data) {
		const cbs = this.listeners.get(event)
		if (cbs) {
			cbs.forEach(cb => cb(data))
		}
	}

	_startEmitting() {
		// Emit updates for random nodes every 2-4 seconds
		this.interval = setInterval(() => {
			if (!this.connected || this.nodes.length === 0) return

			// Update 1-3 random nodes per tick
			const updateCount = Math.floor(Math.random() * 3) + 1
			for (let i = 0; i < updateCount; i++) {
				const nodeIndex = Math.floor(Math.random() * this.nodes.length)
				const node = this.nodes[nodeIndex]

				if (!node.isOnline) continue

				// Simulate tilt changes
				const deltaX = (Math.random() - 0.5) * 8
				const deltaY = (Math.random() - 0.5) * 8
				const newX =
					Math.round(Math.max(-30, Math.min(30, node.x + deltaX)) * 10) / 10
				const newY =
					Math.round(Math.max(-30, Math.min(30, node.y + deltaY)) * 10) / 10

				// Occasionally send boot sentinel for testing
				const sendSentinel = Math.random() > 0.97

				const packet = sendSentinel
					? {
							nodeId: node.id,
							x: 0,
							y: 12.5,
							timestamp: Date.now(),
							isBoot: true,
						}
					: { nodeId: node.id, x: newX, y: newY, timestamp: Date.now() }

				// Update local state
				node.x = sendSentinel ? node.x : newX
				node.y = sendSentinel ? node.y : newY
				node.lastSeen = new Date().toISOString()

				this._emit('node_update', packet)
			}
		}, 2500)
	}
}

// Singleton instance
let instance = null

export function getSocketService() {
	if (!instance) {
		instance = new MockSocketService()
	}
	return instance
}
