export function getAssetUrl(key?: string | null) {
	if (!key) return ''

	if (key.startsWith('http://') || key.startsWith('https://')) {
		return key
	}

	const baseUrl = import.meta.env.VITE_S3_ASSET_BASE_URL

	const normalizedKey = key.replace(/^\/+/, '')

	const encodedKey = normalizedKey
		.split('/')
		.map(part => encodeURIComponent(part))
		.join('/')

	return `${baseUrl}/${encodedKey}`
}
