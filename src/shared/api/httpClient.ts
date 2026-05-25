import axios from 'axios'
import { env } from '../config/env'
import { ApiErrorResponse } from './types'
// import { authStore } from "@/features/auth/model/auth.store";

export const AUTH_EXPIRED_EVENT = 'auth:expired'

export const request = axios.create({
	baseURL: env.API_BASE_URL,
	withCredentials: true,
})

request.interceptors.request.use(config => {
	// const token = authStore.getState().accessToken;
	const token = null

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

request.interceptors.response.use(
	response => response,
	error => {
		if (axios.isAxiosError<ApiErrorResponse>(error)) {
			const message =
				error.response?.data?.message || error.message || 'Something went wrong'

			return Promise.reject(new Error(message))
		}

		return Promise.reject(error)
	},
)
