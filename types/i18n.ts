import type { AbstractIntlMessages } from 'next-intl';

// 메시지 타입 정의 (한국어 메시지를 기준으로)
export type Messages = typeof import('../messages/ko.json');

// next-intl 전역 타입 선언
declare global {
  interface IntlMessages extends Messages {}
}

// 로케일 타입
export type Locale = 'ko' | 'en';