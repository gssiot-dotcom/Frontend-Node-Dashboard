import { ImagePlus, MapPin, MoreHorizontal, Pencil, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Company } from '@/features/admin/types/company.types'
import { EditCompanyForm } from '../types'

import { getAssetUrl } from '@/lib/getAssetUrl'
import { useUploadManagerCompanyLogo } from '../hooks/usemanagerCompany'

export type CompanyDashboardHeaderProps = {
	company: Company
}

export function CompanyDashboardHeader({
	company,
}: CompanyDashboardHeaderProps) {
	const logoInputRef = useRef<HTMLInputElement | null>(null)

	const [editOpen, setEditOpen] = useState(false)
	const [editForm, setEditForm] = useState<EditCompanyForm>({
		name: company.companyName,
		location: company.companyAddress || '',
	})

	const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
	const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
	const [currentLogoKey, setCurrentLogoKey] = useState<string | null>(
		company.companyLogo || null,
	)

	const { mutateAsync: uploadCompanyLogo, isPending: isLogoUploading } =
		useUploadManagerCompanyLogo()

	const savedLogoUrl = getAssetUrl(currentLogoKey)
	const displayLogoUrl = logoPreviewUrl || savedLogoUrl
	const hasSelectedLogo = Boolean(selectedLogoFile && logoPreviewUrl)

	useEffect(() => {
		setCurrentLogoKey(company.companyLogo || null)
		setSelectedLogoFile(null)

		setLogoPreviewUrl(prev => {
			if (prev) URL.revokeObjectURL(prev)
			return null
		})

		if (logoInputRef.current) {
			logoInputRef.current.value = ''
		}
	}, [company._id, company.companyLogo])

	useEffect(() => {
		return () => {
			if (logoPreviewUrl) {
				URL.revokeObjectURL(logoPreviewUrl)
			}
		}
	}, [logoPreviewUrl])

	const handleOpenLogoUpload = () => {
		if (isLogoUploading) return
		logoInputRef.current?.click()
	}

	const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const nextPreviewUrl = URL.createObjectURL(file)

		setLogoPreviewUrl(prev => {
			if (prev) URL.revokeObjectURL(prev)
			return nextPreviewUrl
		})

		setSelectedLogoFile(file)
	}

	const handleCancelLogoChange = () => {
		setSelectedLogoFile(null)

		setLogoPreviewUrl(prev => {
			if (prev) URL.revokeObjectURL(prev)
			return null
		})

		if (logoInputRef.current) {
			logoInputRef.current.value = ''
		}
	}

	const handleSaveLogo = async () => {
		if (!selectedLogoFile) return

		try {
			const updatedCompany = await uploadCompanyLogo({
				companyId: company._id,
				file: selectedLogoFile,
			})

			setCurrentLogoKey(updatedCompany.companyLogo || null)
			setSelectedLogoFile(null)

			setLogoPreviewUrl(prev => {
				if (prev) URL.revokeObjectURL(prev)
				return null
			})

			if (logoInputRef.current) {
				logoInputRef.current.value = ''
			}
		} catch (error) {
			console.error('Failed to upload company logo:', error)
		}
	}

	const handleSubmitEditCompany = () => {
		console.log('Edit company:', { companyId: company._id, ...editForm })
		setEditOpen(false)
	}

	return (
		<>
			<div className='mb-6 hidden md:flex items-start justify-between gap-4'>
				{/* Left: Company Info */}
				<div className='flex items-center gap-4 min-w-0 flex-1'>
					<div className='min-w-0'>
						<div className='flex items-center gap-2 text-muted-foreground text-sm mb-1'>
							<MapPin className='h-4 w-4 shrink-0' />
							<span className='truncate'>{company.companyAddress}</span>
						</div>

						<h1 className='text-2xl lg:text-3xl font-bold text-foreground truncate'>
							{company.companyName}
						</h1>

						<p className='text-sm text-muted-foreground mt-1'>
							회사 관리 및 통계 대시보드
						</p>
					</div>
				</div>

				{/* Right: Logo + Actions */}
				<div className='flex items-center gap-3 shrink-0'>
					<input
						ref={logoInputRef}
						type='file'
						accept='image/*'
						className='hidden'
						onChange={handleLogoFileChange}
					/>

					<div className='flex items-center gap-2'>
						{/* Logo area */}
						{displayLogoUrl ? (
							<button
								type='button'
								onClick={handleOpenLogoUpload}
								disabled={isLogoUploading}
								className='relative w-40 h-20 rounded-xl border border-border bg-card overflow-hidden shrink-0 disabled:opacity-70'
							>
								<img
									src={displayLogoUrl}
									alt={`${company.companyName} logo`}
									className='w-full h-full object-cover'
								/>

								{hasSelectedLogo && !isLogoUploading && (
									<div className='absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white'>
										Preview
									</div>
								)}

								{isLogoUploading && (
									<div className='absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs'>
										Uploading...
									</div>
								)}
							</button>
						) : (
							<button
								type='button'
								onClick={handleOpenLogoUpload}
								disabled={isLogoUploading}
								className='w-40 h-20 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground shrink-0 disabled:opacity-70'
							>
								<ImagePlus className='h-5 w-5' />
								<span className='text-[10px] leading-tight text-center'>
									Upload
									<br />
									Logo
								</span>
							</button>
						)}

						{/* Save / Cancel buttons only after selecting file */}
						{hasSelectedLogo && (
							<div className='flex flex-col gap-1'>
								<Button
									type='button'
									size='sm'
									onClick={handleSaveLogo}
									disabled={isLogoUploading}
									className='h-8 text-xs'
								>
									{isLogoUploading ? 'Saving...' : 'Save'}
								</Button>

								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={handleCancelLogoChange}
									disabled={isLogoUploading}
									className='h-8 text-xs'
								>
									Cancel
								</Button>
							</div>
						)}
					</div>

					{/* Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon' className='shrink-0'>
								<MoreHorizontal className='h-5 w-5' />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align='end' className='w-44'>
							<DropdownMenuItem
								onSelect={event => {
									event.preventDefault()
									handleOpenLogoUpload()
								}}
								disabled={isLogoUploading}
							>
								<Upload className='mr-2 h-4 w-4' />
								Reupload logo
							</DropdownMenuItem>

							<DropdownMenuItem
								onSelect={event => {
									event.preventDefault()
									setEditOpen(true)
								}}
							>
								<Pencil className='mr-2 h-4 w-4' />
								Edit company
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Edit Dialog — unchanged */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Edit company</DialogTitle>
					</DialogHeader>

					<div className='space-y-4 mt-4'>
						<div className='space-y-2'>
							<Label htmlFor='company-name'>Company name</Label>
							<Input
								id='company-name'
								value={editForm.name}
								onChange={event =>
									setEditForm(prev => ({ ...prev, name: event.target.value }))
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='company-location'>Location</Label>
							<Input
								id='company-location'
								value={editForm.location}
								onChange={event =>
									setEditForm(prev => ({
										...prev,
										location: event.target.value,
									}))
								}
							/>
						</div>

						<div className='flex justify-end gap-2 pt-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setEditOpen(false)}
							>
								Cancel
							</Button>

							<Button type='button' onClick={handleSubmitEditCompany}>
								Save
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
