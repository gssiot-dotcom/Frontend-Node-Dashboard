export type ApiResponse<T> = {
	state: 'success' | 'fail'
	message: string
	data: T
	statusCode?: number
}

export type ApiErrorResponse = ApiResponse<null>
