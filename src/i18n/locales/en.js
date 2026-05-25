export default {
	nav: {
		dashboard: 'Dashboard',
		verticalNodes: 'Vertical Nodes',
	},
	sidebar: {
		logout: 'Logout',
	},
	common: {
		loading: 'Loading...',
		save: 'Save',
		cancel: 'Cancel',
		confirm: 'Confirm',
		delete: 'Delete',
		edit: 'Edit',
		search: 'Search',
		goToDashboard: 'Go to Dashboard',
		signup: 'Create Account',
		signin: 'Sign In',
	},

	auth: {
		signin: {
			title: 'Welcome Back',
			description: 'Sign in to your monitoring dashboard',
			email: 'Email',
			password: 'Password',
			signingIn: 'Signing in...',
			question: "Don't have an account?",
			action: 'Sign Up',
		},
		register: {
			title: 'Create Account',
			description: 'Start monitoring your infrastructure',
			name: 'Name',
			email: 'Email',
			phone: 'Phone',
			password: 'Password',
			confirmPassword: 'Confirm Password',
			signingUp: 'Signing up...',
			question: 'Already have an account?',
			action: 'Sign In',
		},
	},

	home: {
		header: {
			title1: 'Intelligent IoT ',
			title2: 'Monitoring',
			title3: 'Infrastructure',
			description:
				'Real-time structural monitoring with precision tilt detection. Protect your infrastructure with next-generation sensor technology.',
		},
		cards: {
			realTimeMonitoring: {
				title: 'Real-time Monitoring',
				description: 'Live sensor data streaming with sub-second latency',
			},
			instantAlerts: {
				title: 'Instant Alerts',
				description: 'Automated tilt detection and threshold warnings',
			},
			remoteAccess: {
				title: 'Remote Access',
				description: 'Monitor your IoT network from anywhere in the world',
			},
		},
	},

	dashboard: {
		buildingsScrollbar: {
			title: 'Buildings',
			subtitle: 'Select building',
			mobileAction: 'Select building',
		},
		header: {
			title: 'Welcome to your Dashboard',
			subtitle: 'Monitor your IoT infrastructure',
			description:
				'Real-time structural monitoring with precision tilt detection. Protect your infrastructure with next-generation sensor technology.',
		},
		statCards: {
			totalNodes: 'Total Nodes',
			online: 'Online',
			alerts: 'Alerts',
		},
		nodeTypes: {
			title: 'Node Types',
			verticalNode: {
				title: 'Vertical Node',
				description: 'T-shaped tilt detection sensors',
			},
			angleNode: {
				title: 'Angle Node',
				description: 'Monitor your construction real-time',
			},
			scaffoldNode: {
				title: 'Scaffold Node',
				description: 'Check your scaffold doors state',
			},
			gateway: {
				title: 'Gateway',
				description: 'Network gateway controllers',
				status: 'Coming Soon',
			},
			sensor: {
				title: 'Sensor',
				description: 'Environmental monitoring sensors',
				status: 'Coming Soon',
			},
		},
		buildingImages: {
			title: 'Building views',
			planImage: {
				title: 'Plan View',
				subtitle: '	Floor plan layout',
			},
			readyImage: {
				title: 'Ready View',
				subtitle: 'Building exterior',
			},
		},
	},

	verticalNodes: {
		header: {
			title: 'Vertical Nodes',
			searchPlaceholder: 'Search nodes',
		},
		filterButtons: {
			all: 'All',
			normal: 'Normal',
			warning: 'Warning',
			danger: 'Danger',
			offline: 'Offline',
		},
		nodeCard: {
			position: 'Position -',
		},
	},
}
