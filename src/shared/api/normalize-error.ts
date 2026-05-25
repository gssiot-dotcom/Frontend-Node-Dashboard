import axios from 'axios'
import { AppError } from './app-error'

export function normalizeError(error: unknown): AppError {
	console.log(error)
	if (axios.isAxiosError(error)) {
		const status = error.response?.status
		const data = error.response?.data as
			| { message?: string; errors?: unknown }
			| undefined

		if (!error.response) {
			return new AppError({
				message: 'Network error. Please check your connection.',
				code: 'NETWORK',
			})
		}

		if (status === 400) {
			return new AppError({
				message: data?.message || 'Validation failed',
				code: 'VALIDATION',
				status,
				details: data?.errors,
			})
		}

		if (status === 401) {
			return new AppError({
				message: 'Your session has expired.',
				code: 'UNAUTHORIZED',
				status,
			})
		}

		if (status === 403) {
			return new AppError({
				message: 'You do not have permission for this action.',
				code: 'FORBIDDEN',
				status,
			})
		}

		if (status === 404) {
			return new AppError({
				message: data?.message || 'Resource not found',
				code: 'NOT_FOUND',
				status,
			})
		}

		if (status && status >= 500) {
			return new AppError({
				message: 'Server error. Please try again later.',
				code: 'SERVER',
				status,
			})
		}

		return new AppError({
			message: data?.message || error.message || 'Unknown request error',
			code: 'UNKNOWN',
			status,
		})
	}

	if (error instanceof Error) {
		return new AppError({
			message: error.message,
			code: 'UNKNOWN',
		})
	}

	return new AppError({
		message: 'Something went wrong.',
		code: 'UNKNOWN',
	})
}
