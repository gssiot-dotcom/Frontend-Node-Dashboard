import { request } from '@/shared/api/httpClient'

export type AssetKind =
	| 'companyLogo'
	| 'buildingPlanImage'
	| 'buildingRealImage'

type CreateUploadUrlParams = {
	kind: AssetKind
	companyId: string
	buildingId?: string
	file: File
}

type CreateUploadUrlResponse = {
	bucket: string
	key: string
	uploadUrl: string
	method: 'PUT'
	headers: {
		'Content-Type': string
	}
}

export async function createUploadUrl(params: CreateUploadUrlParams) {
	const res = await request.post<CreateUploadUrlResponse>(
		'/assets/upload-url',
		{
			kind: params.kind,
			companyId: params.companyId,
			buildingId: params.buildingId,
			fileName: params.file.name,
			contentType: params.file.type,
		},
	)

	return res.data
}

export async function uploadFileToS3(uploadUrl: string, file: File) {
	const res = await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type,
		},
		body: file,
	})

	if (!res.ok) {
		throw new Error('S3 upload failed')
	}
}

export async function saveAssetToDb(params: {
	kind: AssetKind
	companyId: string
	buildingId?: string
	key: string
}) {
	const res = await request.post('/assets/save', params)
	return res.data
}

export async function getAssetViewUrl(key: string) {
	const res = await request.get<{ url: string }>('/assets/view-url', {
		params: { key },
	})

	return res.data.url
}

export async function removeAsset(params: {
	kind: AssetKind
	companyId: string
	buildingId?: string
	key: string
	deleteFromS3?: boolean
}) {
	const res = await request.post('/assets/remove', params)
	return res.data
}
