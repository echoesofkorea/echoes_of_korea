-- Supabase에서 관리자 사용자 생성
-- SQL Editor에서 실행하세요

-- 사용자 생성 (이메일 확인 완료 상태로)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'echoesofkoreaproject@google.com',
  crypt('gksrnrdmlapdkfl', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- 사용자 확인
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'echoesofkoreaproject@google.com';