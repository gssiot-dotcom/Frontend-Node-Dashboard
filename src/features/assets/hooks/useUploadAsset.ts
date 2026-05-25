import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	AssetKind,
	createUploadUrl,
	saveAssetToDb,
	uploadFileToS3,
} from '../api/assetsApi'

type UploadAssetInput = {
	kind: AssetKind
	companyId: string
	buildingId?: string
	file: File
}

export function useUploadAsset() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (input: UploadAssetInput) => {
			const presigned = await createUploadUrl(input)

			await uploadFileToS3(presigned.uploadUrl, input.file)

			const saved = await saveAssetToDb({
				kind: input.kind,
				companyId: input.companyId,
				buildingId: input.buildingId,
				key: presigned.key,
			})

			return {
				key: presigned.key,
				saved,
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['company', variables.companyId],
			})

			if (variables.buildingId) {
				queryClient.invalidateQueries({
					queryKey: ['building', variables.buildingId],
				})
			}
		},
	})
}
