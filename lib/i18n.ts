import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      // 공통
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      save: '저장',
      cancel: '취소',
      edit: '수정',
      delete: '삭제',
      confirm: '확인',
      
      // 인증
      login: '로그인',
      logout: '로그아웃',
      email: '이메일',
      password: '비밀번호',
      loginButton: '로그인',
      loggingIn: '로그인 중...',
      loginTitle: '로그인',
      loginSubtitle: 'Echoes of Korea 관리자 로그인',
      
      // 대시보드
      dashboard: '대시보드',
      totalInterviews: '총 인터뷰',
      completedInterviews: '완료된 인터뷰',
      pendingInterviews: '대기 중인 인터뷰',
      recentActivity: '최근 활동',
      
      // 인터뷰
      interviews: '인터뷰',
      newInterview: '새 인터뷰',
      interviewTitle: '인터뷰 제목',
      interviewDate: '인터뷰 날짜',
      interviewStatus: '상태',
      interviewActions: '작업',
      interviewsList: '인터뷰 목록',
      totalInterviewsCount: '전체 {{count}}개의 인터뷰',
      addNewInterview: '새 인터뷰 추가',
      noInterviewsTitle: '인터뷰가 없습니다',
      noInterviewsMessage: '첫 인터뷰를 추가해보세요.',
      addFirstInterview: '첫 인터뷰 추가하기',
      title: '제목',
      interviewee: '인터뷰이',
      birthYear: '출생년도',
      transcriptionStatus: '전사 상태',
      publicationStatus: '공개 여부',
      actions: '작업',
      viewDetails: '상세보기',
      completed: '완료',
      processing: '진행중',
      waiting: '대기',
      failed: '실패',
      published: '공개',
      unpublished: '비공개',
      
      // 새 인터뷰 폼
      backToInterviews: '인터뷰 목록으로',
      addNewInterviewTitle: '새 인터뷰 추가',
      interviewTitleLabel: '인터뷰 제목',
      interviewTitlePlaceholder: '예: 한국전쟁 참전용사 김OO님 인터뷰',
      intervieweeName: '인터뷰이 성명',
      intervieweeNamePlaceholder: '김OO',
      intervieweeBirthYear: '인터뷰이 출생년도',
      intervieweeBirthYearPlaceholder: '1930',
      interviewDateLabel: '인터뷰 날짜',
      audioFile: '오디오 파일',
      audioFileDescription: 'MP3, WAV, M4A 등의 오디오 파일을 업로드하세요',
      saving: '저장 중...',
      addInterview: '인터뷰 추가',
      addingInterviewError: '인터뷰 추가 중 오류가 발생했습니다.',
      
      // 사이드바
      sidebarDashboard: '대시보드',
      sidebarInterviews: '인터뷰 관리',
      sidebarSettings: '설정',
      sidebarLogout: '로그아웃',
    }
  },
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      
      // Auth
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      loginTitle: 'Login',
      loginSubtitle: 'Echoes of Korea Admin Login',
      
      // Dashboard
      dashboard: 'Dashboard',
      totalInterviews: 'Total Interviews',
      completedInterviews: 'Completed Interviews',
      pendingInterviews: 'Pending Interviews',
      recentActivity: 'Recent Activity',
      
      // Interviews
      interviews: 'Interviews',
      newInterview: 'New Interview',
      interviewTitle: 'Interview Title',
      interviewDate: 'Interview Date',
      interviewStatus: 'Status',
      interviewActions: 'Actions',
      interviewsList: 'Interviews List',
      totalInterviewsCount: 'Total {{count}} interviews',
      addNewInterview: 'Add New Interview',
      noInterviewsTitle: 'No interviews yet',
      noInterviewsMessage: 'Add your first interview.',
      addFirstInterview: 'Add First Interview',
      title: 'Title',
      interviewee: 'Interviewee',
      birthYear: 'Birth Year',
      transcriptionStatus: 'Transcription Status',
      publicationStatus: 'Publication Status',
      actions: 'Actions',
      viewDetails: 'View Details',
      completed: 'Completed',
      processing: 'Processing',
      waiting: 'Waiting',
      failed: 'Failed',
      published: 'Published',
      unpublished: 'Unpublished',
      
      // 새 인터뷰 폼
      backToInterviews: 'Back to Interviews',
      addNewInterviewTitle: 'Add New Interview',
      interviewTitleLabel: 'Interview Title',
      interviewTitlePlaceholder: 'e.g.: Korean War Veteran Mr. Kim Interview',
      intervieweeName: 'Interviewee Name',
      intervieweeNamePlaceholder: 'Mr. Kim',
      intervieweeBirthYear: 'Birth Year',
      intervieweeBirthYearPlaceholder: '1930',
      interviewDateLabel: 'Interview Date',
      audioFile: 'Audio File',
      audioFileDescription: 'Upload audio files such as MP3, WAV, M4A',
      saving: 'Saving...',
      addInterview: 'Add Interview',
      addingInterviewError: 'An error occurred while adding the interview.',
      
      // Sidebar
      sidebarDashboard: 'Dashboard',
      sidebarInterviews: 'Interview Management',
      sidebarSettings: 'Settings',
      sidebarLogout: 'Logout',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // 기본 언어는 한국어
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false, // React는 기본적으로 XSS를 방지함
    },
  });

export default i18n;