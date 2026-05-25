import ProtectedRoute from '@/components/ProtectedRoute'
import RouteErrorBoundary from '@/shared/ui/error/RouteErrorBoundry'
import WorkerDashboardLayout from './components/DashboardLayout'
import AdminAngleNodesPage from './pages/AngleNodes'
import WorkerBuildingsPage from './pages/Buildings'
import VerticalNodes from './pages/GangformNodes'
import ScaffoldingNodes from './pages/ScaffoldNodes'

export const workerRoutes = [
	{
		element: <ProtectedRoute allowedRoles={['worker']} />,
		children: [
			{
				path: '/worker',
				element: <WorkerDashboardLayout />,
				errorElement: <RouteErrorBoundary />,
				children: [
					{
						path: 'dashboard/buildings',
						element: <WorkerBuildingsPage />,
					},
					{
						path: 'buildings/:buildingId/gangform-nodes',
						element: <VerticalNodes />,
					},
					{
						path: 'buildings/:buildingId/scaffold-nodes',
						element: <ScaffoldingNodes />,
					},
					{
						path: 'buildings/:buildingId/angle-nodes',
						element: <AdminAngleNodesPage />,
					},
				],
			},
		],
	},
]
