import DashboardLayout from '@/components/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import RouteErrorBoundary from '@/shared/ui/error/RouteErrorBoundry'
import AngleNodes from './pages/AngleNodes'
import CompanyAssignmentPage from './pages/CompanyAssigning'
import {
	default as CompanyBuilding,
	default as CompanyBuildingsPage,
} from './pages/CompanyBuilding'
import Dashboard from './pages/Dashboard'
import AdminDevicesPage from './pages/DeviceCreate'
import VerticalNodes from './pages/GangformNodes'
import AdminGatewayNodesConnectionByBuildingPage from './pages/GatewayNodesConnection'
import AdminOrganizationPage from './pages/Organizations'
import ScaffoldingNodes from './pages/ScaffoldNodes'

export const adminRoutes = [
	{
		element: <ProtectedRoute allowedRoles={['admin']} />,
		children: [
			{
				path: '/admin',
				element: <DashboardLayout />,
				errorElement: <RouteErrorBoundary />,
				children: [
					{
						path: 'dashboard',
						element: <Dashboard />,
					},
					{
						path: 'companies/:companyId/buildings',
						element: <CompanyBuildingsPage />,
					},
					{
						path: 'companies/:companyId/buildings/:buildingId/devices',
						element: <AdminGatewayNodesConnectionByBuildingPage />,
					},
					{
						path: 'devices',
						element: <AdminDevicesPage />,
					},
					{
						path: 'organizations',
						element: <AdminOrganizationPage />,
					},
					{
						path: 'buildings/:buildingId',
						element: <CompanyBuilding />,
					},
					{
						path: 'buildings/:buildingId/vertical-nodes',
						element: <VerticalNodes />,
					},
					{
						path: 'buildings/:buildingId/gangform-nodes',
						element: <ScaffoldingNodes />,
					},
					{
						path: 'buildings/:buildingId/angle-nodes',
						element: <AngleNodes />,
					},
					{
						path: 'company/assigning',
						element: <CompanyAssignmentPage />,
					},
				],
			},
		],
	},
]
