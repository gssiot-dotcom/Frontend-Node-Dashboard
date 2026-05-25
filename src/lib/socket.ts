import { io, Socket } from 'socket.io-client'

const apiBase = import.meta.env.VITE_API_BASE_URL as string
const socketBase = (apiBase || '/api').replace(/\/api\/?$/, '') || undefined

export type NodeType = 'node' | 'angle' | 'vertical'

export const socket: Socket = io(socketBase, {
	transports: ['websocket'],
	autoConnect: false,
})

export function ensureSocketConnected() {
	if (!socket.connected) {
		socket.connect()
	}
}
