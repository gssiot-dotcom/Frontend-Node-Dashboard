// Parse node number input
export function parseNodeNumbers(input: string): number[] {
	const trimmed = input.trim()
	if (!trimmed) return []

	if (trimmed.includes('-') && !trimmed.includes(',')) {
		const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10))
		if (isNaN(start) || isNaN(end) || start > end) return []
		const result: number[] = []
		for (let i = start; i <= end; i++) {
			result.push(i)
		}
		return result
	}

	if (trimmed.includes(',')) {
		return trimmed
			.split(',')
			.map(s => parseInt(s.trim(), 10))
			.filter(n => !isNaN(n))
	}

	const single = parseInt(trimmed, 10)
	return isNaN(single) ? [] : [single]
}
