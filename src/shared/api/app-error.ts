export type AppErrorCode =
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'VALIDATION'
	| 'NETWORK'
	| 'SERVER'
	| 'UNKNOWN'

type AppErrorParams = {
	message: string
	code: AppErrorCode
	status?: number
	details?: unknown
}

export class AppError extends Error {
	code: AppErrorCode
	status?: number
	details?: unknown

	constructor({ message, code, status, details }: AppErrorParams) {
		super(message)
		this.name = 'AppError'
		this.code = code
		this.status = status
		this.details = details
	}
}

// shared/api/error.ts
import axios from 'axios'
import type { ApiResponse } from './types'

type ApiErrorResponse = ApiResponse<null>

export function getApiErrorMessage(
	error: unknown,
	fallback = 'Something went wrong',
): string {
	if (axios.isAxiosError<ApiErrorResponse>(error)) {
		return error.response?.data?.message || error.message || fallback
	}

	if (error instanceof Error) {
		return error.message
	}

	return fallback
}
