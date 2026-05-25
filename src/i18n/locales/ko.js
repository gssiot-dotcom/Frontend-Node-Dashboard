export default {
	nav: {
		dashboard: '대시보드',
		verticalNodes: '수직 노드',
	},
	sidebar: {
		logout: '로그아웃',
	},
	common: {
		loading: '로딩 중...',
		save: '저장',
		cancel: '취소',
		confirm: '확인',
		delete: '삭제',
		edit: '수정',
		search: '검색',
		goToDashboard: '대시보드로 이동',
		signup: '계정 만들기',
		signin: '로그인',
	},
	auth: {
		signin: {
			title: '환영합니다',
			description: '모니터링 대시보드에 로그인하세요',
			email: '이메일',
			password: '비밀번호',
			signingIn: '로그인 중...',
			question: '계정이 없으신가요?',
			action: '회원가입',
		},
		register: {
			title: '계정 만들기',
			description: '인프라를 모니터링하기 시작하세요',
			name: '이름',
			email: '이메일',
			phone: '전화번호',
			password: '비밀번호',
			confirmPassword: '비밀번호 확인',
			signingUp: '계정 생성 중...',
			question: '이미 계정이 있으신가요?',
			action: '로그인',
		},
	},
	home: {
		header: {
			title1: '지능형 IoT ',
			title2: '모니터링',
			title3: '인프라',

			description:
				'정밀한 기울기 감지를 통한 실시간 구조물 모니터링. 차세대 센서 기술로 인프라를 보호하세요.',
		},
		cards: {
			realTimeMonitoring: {
				title: '실시간 모니터링',
				description: '1초 미만 지연으로 센서 데이터를 실시간 스트리밍합니다',
			},
			instantAlerts: {
				title: '즉시 알림',
				description: '기울기 감지 및 임계값 경고를 자동으로 제공합니다',
			},
			remoteAccess: {
				title: '원격 접속',
				description: '전 세계 어디서나 IoT 네트워크를 모니터링할 수 있습니다',
			},
		},
	},

	dashboard: {
		buildingsScrollbar: {
			title: '건물',
			subtitle: '건물을 선택하세요',
			mobileAction: '건물을 선택',
		},
		header: {
			title: '대시보드에 오신 것을 환영합니다',
			subtitle: 'IoT 인프라를 모니터링하세요',
			description:
				'정밀한 기울기 감지를 통한 실시간 구조물 모니터링. 차세대 센서 기술로 인프라를 보호하세요.',
		},
		statCards: {
			totalNodes: '전체 노드',
			online: '온라인',
			alerts: '알림',
		},
		nodeTypes: {
			title: '노드 유형',
			verticalNode: {
				title: '수직 노드',
				description: 'T자형 기울기 감지 센서',
			},
			angleNode: {
				title: '비계전도 노드',
				description: '건설 현장을 실시간으로 모니터링하세요',
			},
			scaffoldNode: {
				title: '해치발판 노드',
				description: '비계 문 상태를 확인하세요',
			},
		},

		buildingImages: {
			title: '빌딩 뷰',
			planImage: {
				title: '빌딩 도면',
				subtitle: '평면도 레이아웃',
			},
			readyImage: {
				title: '건축 모습',
				subtitle: '건물 외관',
			},
		},
	},

	verticalNodes: {
		header: {
			title: '수직 노드',
			searchPlaceholder: '노드를 검색하기...',
		},
		filterButtons: {
			all: '전체',
			normal: '정상',
			warning: '주의',
			danger: '위험',
			offline: '오프라인',
		},
		nodeCard: {
			position: '위치 -',
		},
	},
}
