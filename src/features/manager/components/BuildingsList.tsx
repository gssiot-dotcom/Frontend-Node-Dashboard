import { BuildingCard } from './BuilidngCard'

export function BuildingsList({ buildings, selectedBuildingId, onSelect }) {
	return (
		<div className='p-3 space-y-2'>
			{buildings.map(building => (
				<BuildingCard
					key={building.id}
					building={building}
					isSelected={building.id === selectedBuildingId}
					onSelect={() => onSelect(building.id)}
				/>
			))}
		</div>
	)
}
