import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	AlertCircle,
	CheckCircle2,
	Cpu,
	Info,
	Plus,
	Router,
} from 'lucide-react'
import { useState } from 'react'
import { useCreateAdminGateway } from '../hooks/useGateways'
import { useCreateAdminNodes } from '../hooks/useNodes'
import { parseNodeNumbers } from '../pages/DeviceCreate'
import { GATEWAY_TYPES, GatewayTypes } from '../types/gateway.types'
import { NODE_TYPES, NodeTypes } from '../types/node.types'

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message

	return '요청 처리 중 오류가 발생했습니다.'
}

function DevicesCreateSection() {
	// Node creation state
	const [nodeInput, setNodeInput] = useState('')
	const [nodeType, setNodeType] = useState<NodeTypes | ''>('')
	const [nodeResult, setNodeResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	// Gateway creation state
	const [gatewaySerial, setGatewaySerial] = useState('')
	const [gatewayType, setGatewayType] = useState<GatewayTypes | ''>('')
	const [gatewayZone, setGatewayZone] = useState('')
	const [gatewayResult, setGatewayResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const parsedNodes = parseNodeNumbers(nodeInput)

	const createNodesMutation = useCreateAdminNodes()
	const createGatewayMutation = useCreateAdminGateway()
	const nodeSubmitting = createNodesMutation.isPending
	const gatewaySubmitting = createGatewayMutation.isPending

	const handleCreateNodes = async () => {
		if (parsedNodes.length === 0 || !nodeType) return

		setNodeResult(null)

		try {
			const result = await createNodesMutation.mutateAsync({
				nodeType,
				nodeNumbers: parsedNodes,
			})

			setNodeResult({
				success: true,
				message: `${result.data.count}개의 노드가 생성되었습니다.`,
			})

			setNodeInput('')
			setNodeType('')
		} catch (error) {
			setNodeResult({
				success: false,
				message: getErrorMessage(error),
			})
		}
	}

	const handleCreateGateway = async () => {
		if (!gatewaySerial || !gatewayType) return

		setGatewayResult(null)

		try {
			await createGatewayMutation.mutateAsync({
				serialNumber: gatewaySerial,
				gatewayType,
				installedLocation: gatewayZone || undefined,
			})

			setGatewayResult({
				success: true,
				message: `게이트웨이가 생성되었습니다. (${gatewaySerial})`,
			})

			setGatewaySerial('')
			setGatewayType('')
			setGatewayZone('')
		} catch (error) {
			setGatewayResult({
				success: false,
				message: getErrorMessage(error),
			})
		}
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Node Creation Card */}
			<div className='glass rounded-xl p-5 sm:p-6'>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
						<Cpu className='w-5 h-5 text-primary' />
					</div>
					<div>
						<h2 className='font-semibold text-foreground'>노드 생성</h2>
						<p className='text-xs text-muted-foreground'>
							여러 노드를 한 번에 등록
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='node-numbers' className='text-sm font-medium'>
							노드 번호
						</Label>
						<Input
							id='node-numbers'
							placeholder='예: 1 또는 1-10 또는 1,13,43,23'
							value={nodeInput}
							onChange={e => {
								setNodeInput(e.target.value)
								setNodeResult(null)
							}}
						/>
						<div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
							<Info className='w-3.5 h-3.5 mt-0.5 shrink-0' />
							<span>단일: 1 | 범위: 1-10 | 여러개: 1,13,43,23</span>
						</div>
					</div>

					{parsedNodes.length > 0 && (
						<div className='bg-muted/30 rounded-lg p-3'>
							<p className='text-xs font-medium text-muted-foreground mb-2'>
								생성될 노드 ({parsedNodes.length}개)
							</p>
							<div className='flex flex-wrap gap-1.5'>
								{parsedNodes.slice(0, 20).map(num => (
									<span
										key={num}
										className='px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded'
									>
										{num}
									</span>
								))}
								{parsedNodes.length > 20 && (
									<span className='px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded'>
										+{parsedNodes.length - 20}개 더
									</span>
								)}
							</div>
						</div>
					)}

					<div className='space-y-2'>
						<Label htmlFor='node-type' className='text-sm font-medium'>
							노드 타입
						</Label>
						<Select
							value={nodeType}
							onValueChange={value => setNodeType(value as NodeTypes)}
						>
							<SelectTrigger id='node-type'>
								<SelectValue placeholder='노드 타입 선택' />
							</SelectTrigger>
							<SelectContent>
								{NODE_TYPES.map(type => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{nodeResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${nodeResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
						>
							{nodeResult.success ? (
								<CheckCircle2 className='w-4 h-4' />
							) : (
								<AlertCircle className='w-4 h-4' />
							)}
							{nodeResult.message}
						</div>
					)}

					<Button
						onClick={handleCreateNodes}
						disabled={parsedNodes.length === 0 || !nodeType || nodeSubmitting}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{nodeSubmitting
							? '생성 중...'
							: `노드 생성 ${parsedNodes.length > 0 ? `(${parsedNodes.length}개)` : ''}`}
					</Button>
				</div>
			</div>
			{/* Gateway Creation Card */}
			<div className='glass rounded-xl p-5 sm:p-6'>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
						<Router className='w-5 h-5 text-primary' />
					</div>
					<div>
						<h2 className='font-semibold text-foreground'>게이트웨이 생성</h2>
						<p className='text-xs text-muted-foreground'>
							게이트웨이 장치 등록
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='gateway-serial' className='text-sm font-medium'>
							시리얼 번호
						</Label>
						<Input
							id='gateway-serial'
							placeholder='예: GW-2024-001'
							value={gatewaySerial}
							onChange={e => {
								setGatewaySerial(e.target.value)
								setGatewayResult(null)
							}}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='gateway-type' className='text-sm font-medium'>
							게이트웨이 타입
						</Label>
						<Select
							value={gatewayType}
							onValueChange={value => setGatewayType(value as GatewayTypes)}
						>
							<SelectTrigger id='gateway-type'>
								<SelectValue placeholder='게이트웨이 타입 선택' />
							</SelectTrigger>
							<SelectContent>
								{GATEWAY_TYPES.map(type => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='gateway-zone' className='text-sm font-medium'>
							구역 이름{' '}
							<span className='text-muted-foreground font-normal'>
								(선택사항)
							</span>
						</Label>
						<Input
							id='gateway-zone'
							placeholder='예: A동 1층'
							value={gatewayZone}
							onChange={e => {
								setGatewayZone(e.target.value)
								setGatewayResult(null)
							}}
						/>
					</div>

					{gatewayResult && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg text-sm ${gatewayResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}
						>
							{gatewayResult.success ? (
								<CheckCircle2 className='w-4 h-4' />
							) : (
								<AlertCircle className='w-4 h-4' />
							)}
							{gatewayResult.message}
						</div>
					)}

					<Button
						onClick={handleCreateGateway}
						disabled={!gatewaySerial || !gatewayType || gatewaySubmitting}
						className='w-full gap-2'
					>
						<Plus className='w-4 h-4' />
						{gatewaySubmitting ? '생성 중...' : '게이트웨이 생성'}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DevicesCreateSection
