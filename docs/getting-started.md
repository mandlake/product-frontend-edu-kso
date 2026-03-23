# Getting Started — 템플릿 초기 설정 가이드

> 이 템플릿을 클론한 뒤 **처음 해야 할 일**을 순서대로 안내합니다.

### 문서 읽는 순서

| #   | 문서                                    | 내용                             |
| --- | --------------------------------------- | -------------------------------- |
| 1   | **이 문서**                             | 초기 설정 (환경, 색상, 에셋)     |
| 2   | [프로젝트 구조](./architecture.md)      | FSD 아키텍처, 레이어별 역할      |
| 3   | [컬러 시스템](./color-system.md)        | CSS Variables + Tailwind 테마    |
| 4   | [텍스트 스타일](./text-component.md)    | Text 컴포넌트 Typography         |
| 5   | [데이터 흐름](./tanstack-query-flow.md) | TanStack Query SSR/캐시          |
| 6   | [다이얼로그/모달](./dialog-modal.md)    | Imperative Dialog vs Route Modal |
| 7   | [API 모킹](./msw.md)                    | MSW 핸들러 작성법                |
| 8   | [개발 도구](./devtools.md)              | ESLint, Plop, Vitest, Storybook  |

---

## Step 0. 환경 준비

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
```

### 환경별 env 파일

| 파일               | 용도                        | 실행                 |
| ------------------ | --------------------------- | -------------------- |
| `.env.development` | 로컬 개발                   | `pnpm dev`           |
| `.env.staging`     | 스테이징 배포               | `pnpm build:staging` |
| `.env.production`  | 프로덕션 배포               | `pnpm build`         |
| `.env.local`       | 개인 오버라이드 (gitignore) | 모든 환경            |

```bash
# .env.development (로컬)
NEXT_PUBLIC_API_URL=/api
API_BASE_URL=http://localhost:4000
```

### API 프록시 흐름

클라이언트 요청은 `next.config.ts` rewrites를 통해 백엔드로 프록시됩니다:

```
브라우저 → /api/todos → Next.js rewrites → API_BASE_URL/todos
```

> 환경 변수를 추가하려면 `src/shared/config/env.ts`에 Zod 스키마도 함께 추가하세요.

---

## Step 1. 프로젝트 정보 입력

**파일**: `src/shared/config/site.ts`

이 파일 하나로 사이트 전체의 메타데이터가 결정됩니다 (SEO, OG 태그, JSON-LD 등).

```typescript
export const siteConfig = {
  name: 'My App', // ← 사이트 이름
  description: '프로젝트 설명을 입력하세요', // ← 사이트 설명
  url: 'https://example.com', // ← 실제 도메인
  ogImage: '/og-image.png', // ← OG 이미지 (public/ 폴더)
  locale: 'ko_KR', // ← 로케일
  enableDarkMode: true, // ← false로 변경 시 다크모드 비활성화
  logo: '/logo.png', // ← 로고 (public/ 폴더)
  links: [], // ← SNS 프로필 URL
}
```

**연결 파일** (자동 반영, 수정 불필요):

- `src/app/layout.tsx` — metadata, JSON-LD 스키마
- `src/app/sitemap.ts` — 사이트맵 URL

---

## Step 2. 브랜딩 에셋 교체

`public/` 폴더에 아래 파일을 교체하세요:

| 파일           | 용도                | 사이즈   |
| -------------- | ------------------- | -------- |
| `favicon.ico`  | 브라우저 탭 아이콘  | 32x32    |
| `og-image.png` | SNS 공유 이미지     | 1200x630 |
| `logo.png`     | 조직 로고 (JSON-LD) | 자유     |

---

## Step 3. 테마 색상 설정

**파일**: `src/app/globals.css`

라이트/다크 모드 색상을 변경하려면 `:root`와 `.dark`의 HSL 값을 수정하세요.
커스텀 컬러를 추가하려면 CSS 변수 → `@theme inline` 매핑 → Tailwind 사용 3단계입니다.

> 상세 가이드: [컬러 시스템](./color-system.md)

---

## Step 4. 폰트 변경

**파일**: `src/app/layout.tsx`

기본 폰트는 **Pretendard Variable (로컬)** 입니다.
`variable` 이름(`--font-sans-face`)만 유지하면 globals.css가 자동 연결됩니다.

### 현재 설정

```tsx
import localFont from 'next/font/local'

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-sans-face',
  display: 'swap',
  weight: '100 900',
})
```

### 폰트 교체 방법

1. `public/fonts/`에 새 폰트 파일(.woff2)을 넣고
2. `layout.tsx`에서 `src` 경로만 변경

```tsx
// 예: Spoqa Han Sans Neo로 교체
const spoqa = localFont({
  src: '../../public/fonts/SpoqaHanSansNeoVariable.woff2',
  variable: '--font-sans-face', // ← 이름 유지
  display: 'swap',
  weight: '100 900',
})
```

> **주의**: `variable` 이름을 변경하면 `globals.css`의 `@theme` 매핑도 함께 수정해야 합니다.

### Storybook 폰트 연결

`next/font/local`은 Next.js 빌드에서만 동작하므로 Storybook에서는 별도 설정이 필요합니다.

**파일**: `.storybook/fonts.css`

```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('/fonts/PretendardVariable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --font-sans-face: 'Pretendard Variable';
}
```

`preview.ts`에서 `globals.css` 앞에 import합니다:

```ts
import './fonts.css'
import '../src/app/globals.css'
```

> 폰트를 교체할 경우 `fonts.css`의 `@font-face`와 `--font-sans-face` 값도 함께 변경하세요.

---

## Step 5. 텍스트 스타일 추가

**파일**: `src/shared/ui/atoms/text/Text.variants.ts`

프로젝트 디자인 토큰에 맞게 `size`, `color` variant 옵션을 추가하세요.
globals.css에 커스텀 사이즈/컬러를 정의한 뒤, `Text.variants.ts`의 TEMPLATE 주석을 따라 추가합니다.

> 상세 가이드: [텍스트 스타일](./text-component.md)

---

## Step 6. 에러 메시지 수정

**파일**: `src/shared/config/messages.ts`

앱 전체에서 사용하는 에러 메시지를 프로젝트에 맞게 수정하세요.

```typescript
export const ERROR_MESSAGES = {
  DEFAULT: '요청 처리 중 오류가 발생했습니다',
  NETWORK: '네트워크 연결을 확인해 주세요.',
  // ...
}
```

---

## Step 7. 예제 코드 정리

템플릿에 포함된 예제 파일들은 참고 후 삭제하세요:

| 경로                                 | 설명                            |
| ------------------------------------ | ------------------------------- |
| `src/app/example/`                   | 예제 페이지 (route modal 포함)  |
| `src/entities/example-todo/`         | 예제 Entity (API, Query, 타입)  |
| `src/features/example-todo/`         | 예제 Feature (Form, List, Item) |
| `src/widgets/example-todo/`          | 예제 Widget                     |
| `src/widgets/dialog-demo/`           | Dialog 데모 Widget              |
| `src/mocks/data/example-todo.ts`     | 예제 mock 데이터                |
| `src/mocks/handlers/example-todo.ts` | 예제 mock 핸들러                |

삭제 후 `src/mocks/handlers/index.ts`와 `src/mocks/data/index.ts`에서 해당 import도 제거하세요.

---

## Step 8. 새 도메인 생성

Plop 코드 제너레이터로 FSD 구조에 맞는 파일을 자동 생성합니다.

```bash
pnpm gen
```

선택 가능: **entity** (도메인 모델) / **feature** (비즈니스 기능) / **widget** (페이지 UI)

> 상세 가이드: [개발 도구 — 코드 생성](./devtools.md#3-코드-생성-plop)

---

## Step 9. 사이트맵 업데이트

**파일**: `src/app/sitemap.ts`

페이지를 추가할 때마다 사이트맵도 함께 업데이트하세요.

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date() },
    // 정적 페이지 추가
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
  ]
}
```

---

## 선택사항

### React Compiler

Next.js 16부터 React Compiler가 기본 내장됩니다. 별도 설정 불필요.

### 새 Provider 추가

**파일**: `src/shared/providers/index.tsx`

인증, i18n 등 글로벌 Provider를 `AppProviders`에 추가하세요.

### Mock API 핸들러 추가

**파일**: `src/mocks/handlers/`

> 상세 가이드: [API 모킹](./msw.md)

---

## 파일 맵 (한눈에 보기)

| 목적                      | 파일                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| 프로젝트 정보 (이름, URL) | `src/shared/config/site.ts`                                                 |
| 환경 변수                 | `.env.local` + `src/shared/config/env.ts`                                   |
| 테마 색상                 | `src/app/globals.css` → [가이드](./color-system.md)                         |
| 폰트 변경                 | `src/app/layout.tsx` → `fontSans`/`fontInter` 교체                          |
| 다크모드 on/off           | `src/shared/config/site.ts` → `enableDarkMode`                              |
| 텍스트 스타일             | `src/shared/ui/atoms/text/Text.variants.ts` → [가이드](./text-component.md) |
| 에러 메시지               | `src/shared/config/messages.ts`                                             |
| SEO 메타데이터            | `src/app/layout.tsx` (자동, site.ts 수정으로 반영)                          |
| 사이트맵                  | `src/app/sitemap.ts`                                                        |
| 보안 헤더 (정적)          | `next.config.ts` → X-Frame-Options 등                                       |
| 보안 헤더 (CSP/nonce)     | `src/proxy.ts` → Content-Security-Policy                                    |
| 인증 게이트웨이 (TODO)    | `src/proxy.ts` → 세션 체크, `src/shared/api/http.ts` → 토큰 부착            |
| 글로벌 Provider           | `src/shared/providers/index.tsx`                                            |
| 코드 생성                 | `pnpm gen` → [가이드](./devtools.md#3-코드-생성-plop)                       |
| 데이터 흐름               | [TanStack Query 가이드](./tanstack-query-flow.md)                           |
| 모달/다이얼로그           | [Dialog 가이드](./dialog-modal.md)                                          |
| API 모킹                  | [MSW 가이드](./msw.md)                                                      |

---

[다음: 프로젝트 구조 →](./architecture.md)
