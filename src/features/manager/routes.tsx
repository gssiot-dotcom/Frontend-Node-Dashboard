import ProtectedRoute from '@/components/ProtectedRoute'
import RouteErrorBoundary from '@/shared/ui/error/RouteErrorBoundry'
import ManagerDashboardLayout from './components/DashboardLayout'
import ManagerAngleNodesPage from './pages/AngleNodes'
import BuildingsPage from './pages/Buildings'
import ManagerDashboard from './pages/Dashboard'
import ManagerCompanyDevicesPage from './pages/Devices'
import VerticalNodes from './pages/GangformNodes'
import OrganizationPage from './pages/Organizations'
import ScaffoldingNodes from './pages/ScaffoldNodes'

export const managerRoutes = [
	{
		element: <ProtectedRoute allowedRoles={['manager', 'admin']} />,
		children: [
			{
				path: '/manager',
				element: <ManagerDashboardLayout />,
				errorElement: <RouteErrorBoundary />,
				children: [
					{
						path: 'dashboard',
						element: <ManagerDashboard />,
					},
					{
						path: 'buildings',
						element: <BuildingsPage />,
					},
					{
						path: 'devices',
						element: <ManagerCompanyDevicesPage />,
					},
					{
						path: 'organizations',
						element: <OrganizationPage />,
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
						element: <ManagerAngleNodesPage />,
					},
				],
			},
		],
	},
]
