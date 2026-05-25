// /**
//  * Mock Auth Service
//  *
//  * Replace these functions with real API calls when connecting to backend.
//  * All functions return promises to match real async API behavior.
//  *
//  * Session is stored in localStorage under 'gss_auth'.
//  */

// const STORAGE_KEY = 'gss_auth'
// const FAKE_DELAY = 800

// const MOCK_USERS = [
// 	{
// 		id: '1',
// 		name: 'Admin User',
// 		email: 'admin@gss.io',
// 		phone: '010-1234-5678',
// 		password: 'admin123',
// 	},
// 	{
// 		id: '2',
// 		name: 'Test User',
// 		email: 'test@gss.io',
// 		phone: '010-8765-4321',
// 		password: 'test123',
// 	},
// ]

// function delay(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms))
// }

// export async function login(email, password) {
// 	await delay(FAKE_DELAY)
// 	const user = MOCK_USERS.find(
// 		u => u.email === email && u.password === password,
// 	)
// 	if (!user) {
// 		throw new Error('Invalid email or password')
// 	}
// 	const session = {
// 		user: {
// 			id: user.id,
// 			name: user.name,
// 			email: user.email,
// 			phone: user.phone,
// 		},
// 		token: `mock_token_${user.id}_${Date.now()}`,
// 		isAuthenticated: true,
// 	}
// 	localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
// 	return session
// }

// export async function signup(data) {
// 	await delay(FAKE_DELAY)
// 	const existing = MOCK_USERS.find(u => u.email === data.email)
// 	if (existing) {
// 		throw new Error('Email already registered')
// 	}
// 	// In mock, we just pretend it succeeded
// 	return { success: true, message: 'Account created successfully' }
// }

// export async function logout() {
// 	await delay(300)
// 	localStorage.removeItem(STORAGE_KEY)
// }

// export function getSession() {
// 	const raw = localStorage.getItem(STORAGE_KEY)
// 	if (!raw) return null
// 	try {
// 		return JSON.parse(raw)
// 	} catch {
// 		return null
// 	}
// }

// export function isAuthenticated() {
// 	const session = getSession()
// 	return session?.isAuthenticated === true
// }
