# Vercel에서 Supabase 설정하기

## 1. 필요한 환경변수

현재 프로젝트에서 사용하는 Supabase 환경변수:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (선택사항 - API routes에서 사용)

## 2. Supabase에서 정보 가져오기

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 값들을 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key: `SUPABASE_SERVICE_KEY` (주의: 이 키는 서버에서만 사용)

## 3. Vercel에서 환경변수 설정

### 방법 1: Vercel 대시보드에서 설정

1. [Vercel Dashboard](https://vercel.com)에 로그인
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. 좌측 메뉴에서 **Environment Variables** 선택
5. 각 환경변수 추가:
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environment: Production, Preview, Development
   ```
   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environment: Production, Preview, Development
   ```
   ```
   Key: SUPABASE_SERVICE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environment: Production, Preview, Development
   ```

6. **Save** 버튼 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치 (이미 설치되어 있다면 생략)
npm i -g vercel

# 프로젝트 연결
vercel link

# 환경변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
```

## 4. 추가 설정 (선택사항)

### STT 서비스 관련 환경변수
만약 STT(Speech-to-Text) 기능을 사용한다면:
```
STT_WEBHOOK_SECRET=your-webhook-secret
STT_API_URL=your-stt-api-url
STT_API_KEY=your-stt-api-key
STT_API_SECRET=your-stt-api-secret
```

### 앱 URL 설정
Webhook이나 리다이렉트를 위해:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 5. 배포 후 확인사항

1. **환경변수 적용 확인**
   - 새 배포가 필요할 수 있음
   - Vercel 대시보드에서 **Deployments** → **Redeploy** 클릭

2. **Supabase 보안 설정**
   - Supabase 대시보드 → Authentication → URL Configuration
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs에 추가:
     - `https://your-app.vercel.app/*`
     - `https://your-app.vercel.app/login`
     - `https://your-app.vercel.app/admin/*`

3. **CORS 설정** (필요한 경우)
   - Supabase Storage를 사용한다면 CORS 정책 확인
   - API Settings에서 허용된 도메인 추가

## 6. 문제 해결

### 환경변수가 적용되지 않는 경우
1. Vercel 대시보드에서 환경변수가 올바르게 설정되었는지 확인
2. `NEXT_PUBLIC_` 접두사가 필요한 변수에 제대로 붙어있는지 확인
3. 재배포 실행

### 인증 오류가 발생하는 경우
1. Supabase의 Site URL이 Vercel 도메인과 일치하는지 확인
2. anon key와 service key가 올바른지 확인
3. Supabase 프로젝트가 일시정지되지 않았는지 확인

### 빌드 오류가 발생하는 경우
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
```

## 7. 보안 주의사항

⚠️ **중요**: 
- `SUPABASE_SERVICE_KEY`는 절대 클라이언트 코드에서 사용하지 마세요
- 이 키는 서버 사이드(API routes, server components)에서만 사용해야 합니다
- GitHub 등에 커밋하지 마세요 (.env.local은 .gitignore에 포함되어야 함)

## 8. 확인 명령어

배포 후 환경변수가 제대로 설정되었는지 확인:
```bash
# Vercel CLI로 환경변수 목록 확인
vercel env ls
```