# 개발 도구 설정 가이드

> DX(Developer Experience) 향상을 위한 개발 도구 설정 문서

[← 이전: API 모킹](./msw.md)

## 목차

1. [린팅 & 포맷팅](#1-린팅--포맷팅)
2. [Git Hooks](#2-git-hooks)
3. [코드 생성 (Plop)](#3-코드-생성-plop)
4. [테스트 (Vitest)](#4-테스트-vitest)
5. [아키텍처 검증 (Steiger)](#5-아키텍처-검증-steiger)
6. [미사용 코드 탐지 (Knip)](#6-미사용-코드-탐지-knip)
7. [Storybook](#7-storybook)

---

## 1. 린팅 & 포맷팅

### ESLint

**설정 파일**: `eslint.config.mjs`

ESLint 9의 Flat Config 형식을 사용합니다.

#### 플러그인 구성

| 플러그인                        | 용도                                 |
| ------------------------------- | ------------------------------------ |
| `eslint-config-next`            | Next.js Core Web Vitals + TypeScript |
| `@tanstack/eslint-plugin-query` | TanStack Query 베스트 프랙티스       |
| `eslint-plugin-security`        | 보안 취약점 탐지                     |
| `eslint-plugin-no-secrets`      | 하드코딩된 시크릿 탐지               |
| `eslint-plugin-storybook`       | Storybook 린팅                       |

#### 접근성(A11y) 규칙

`jsx-a11y` 플러그인으로 접근성 강화:

```javascript
'jsx-a11y/alt-text': 'error',
'jsx-a11y/aria-props': 'error',
'jsx-a11y/aria-role': 'error',
'jsx-a11y/click-events-have-key-events': 'error',
'jsx-a11y/no-noninteractive-element-interactions': 'error',
'jsx-a11y/no-noninteractive-tabindex': 'error',
'jsx-a11y/tabindex-no-positive': 'error',
```

#### 네이티브 HTML 금지 규칙

shadcn/Radix 컴포넌트 사용을 권장하기 위해 네이티브 HTML 사용 시 경고:

| 금지 요소    | 대체 컴포넌트                                  |
| ------------ | ---------------------------------------------- |
| `<button>`   | `<Button>` from `@/shared/ui/_base/button`     |
| `<input>`    | `<Input>` from `@/shared/ui/_base/input`       |
| `<textarea>` | `<Textarea>` from `@/shared/ui/_base/textarea` |
| `<select>`   | `<Select>` from `@/shared/ui/_base/select`     |
| `<label>`    | `<Label>` from `@/shared/ui/_base/label`       |
| `<a>`        | `<Link>` from `next/link`                      |
| `<img>`      | `<Image>` from `next/image`                    |

> `src/shared/ui/_base/` 내부는 이 규칙에서 제외됩니다.

#### 실행

```bash
pnpm lint          # 검사
pnpm lint --fix    # 자동 수정
```

---

### Prettier

**설정 파일**: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

| 옵션            | 값      | 설명                    |
| --------------- | ------- | ----------------------- |
| `semi`          | `false` | 세미콜론 제거           |
| `singleQuote`   | `true`  | 작은따옴표 사용         |
| `tabWidth`      | `2`     | 들여쓰기 2칸            |
| `trailingComma` | `"es5"` | ES5 호환 trailing comma |
| `printWidth`    | `80`    | 줄 너비 80자            |
| `endOfLine`     | `"lf"`  | LF 줄바꿈 (Unix)        |

#### 실행

```bash
pnpm format        # 전체 포맷팅
```

---

## 2. Git Hooks

### Husky

**설정 폴더**: `.husky/`

Git 훅을 관리합니다.

#### pre-commit 훅

커밋 전 lint-staged 실행:

```bash
# .husky/pre-commit
pnpm exec lint-staged
```

#### commit-msg 훅

커밋 메시지 검증:

```bash
# .husky/commit-msg
pnpm exec commitlint --edit $1
```

---

### lint-staged

**설정 위치**: `package.json`

스테이징된 파일만 검사하여 커밋 속도 향상:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

| 파일 타입                 | 처리                          |
| ------------------------- | ----------------------------- |
| `*.ts`, `*.tsx`           | ESLint 수정 + Prettier 포맷팅 |
| `*.css`, `*.json`, `*.md` | Prettier 포맷팅               |

---

### Commitlint

**설정 파일**: `commitlint.config.mjs`

커밋 메시지 형식을 검증합니다.

#### 허용되는 타입

| 타입       | 용도                 |
| ---------- | -------------------- |
| `feat`     | 새로운 기능          |
| `fix`      | 버그 수정            |
| `refactor` | 리팩토링             |
| `style`    | 코드 스타일 (포맷팅) |
| `docs`     | 문서                 |
| `test`     | 테스트               |
| `chore`    | 빌드, 설정 등        |
| `perf`     | 성능 개선            |
| `revert`   | 커밋 되돌리기        |

#### 규칙

```javascript
{
  'type-enum': [2, 'always', [/* 위 타입 목록 */]],
  'subject-case': [0],           // 대소문자 규칙 비활성화 (한글 지원)
  'header-max-length': [1, 'always', 100],
  'body-max-line-length': [0],   // 본문 줄 길이 무제한
}
```

> `subject-case: [0]`으로 한글 커밋 메시지를 지원합니다.

#### 커밋 예시

```bash
git commit -m "feat: 로그인 폼 유효성 검사 추가"
git commit -m "fix: 배송지 목록 스크롤 오류 수정"
git commit -m "refactor: OrderForm 컴포넌트 구조 개선"
```

---

## 3. 코드 생성 (Plop)

**설정 파일**: `plopfile.mjs`

FSD 구조에 맞는 코드를 자동 생성합니다.

### 실행

```bash
pnpm gen
```

대화형 프롬프트가 나타나 제너레이터를 선택할 수 있습니다.

---

### Feature 생성

```bash
pnpm gen feature
# Feature 이름 (예: auth, coupon): coupon
```

생성되는 구조:

```
src/features/coupon/
├── ui/
│   ├── Coupon.tsx        # 메인 컴포넌트
│   └── index.ts          # UI export
├── model/
│   ├── form-options.ts   # 폼 옵션 (Zod + RHF)
│   └── index.ts          # 세그먼트 export
└── lib/
    └── index.ts          # 유틸리티 export
```

---

### Entity 생성

```bash
pnpm gen entity
# Entity 이름 (예: user, order): order
```

생성되는 구조:

```
src/entities/order/
├── api/
│   ├── index.ts          # API 객체
│   └── queries.ts        # TanStack Query 훅
└── model/
    ├── index.ts          # 세그먼트 export
    └── types.ts          # 타입 정의
```

---

### Widget 생성

```bash
pnpm gen widget
# Widget 이름 (예: order, shipping): order
```

생성되는 구조:

```
src/widgets/order/
├── OrderContent.tsx      # 메인 위젯 ('use client')
└── index.ts              # export
```

---

### Page 생성

```bash
pnpm gen page
# 페이지 타입 선택: static | prefetch | dynamic | modal
# 경로 (예: (order)/coupon): (order)/coupon
# 페이지 이름 (예: coupon): coupon
```

#### 페이지 타입별 생성 파일

| 타입       | 설명                    | 생성 파일                                                                           |
| ---------- | ----------------------- | ----------------------------------------------------------------------------------- |
| `static`   | 정적 페이지             | `page.tsx`, `loading.tsx`, `error.tsx`                                              |
| `prefetch` | TanStack Query prefetch | `page.tsx`, `loading.tsx`, `error.tsx`                                              |
| `dynamic`  | 동적 라우트 `[param]`   | `[param]/page.tsx`, `loading.tsx`, `error.tsx`                                      |
| `modal`    | Parallel Routes 모달    | `@modal/default.tsx`, `@modal/(.)slug/page.tsx`, `layout.tsx` (라우트 그룹 내 생성) |

#### 예시

```bash
# Static 페이지
pnpm gen page
# type: static, path: about, name: about
# → src/app/about/page.tsx

# Dynamic 페이지
pnpm gen page
# type: dynamic, path: (order)/shipping, name: shipping, param: id
# → src/app/(order)/shipping/[id]/page.tsx
```

---

## 4. 테스트 (Vitest)

**설정 파일**: `vitest.config.ts`

### 설정

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

| 옵션          | 값                       | 설명                     |
| ------------- | ------------------------ | ------------------------ |
| `environment` | `jsdom`                  | 브라우저 환경 시뮬레이션 |
| `setupFiles`  | `vitest.setup.ts`        | 테스트 전 실행 파일      |
| `include`     | `src/**/*.test.{ts,tsx}` | 테스트 파일 패턴         |

### 테스트 파일 컨벤션

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx    # 단위 테스트
└── index.ts
```

### 실행

```bash
pnpm test              # 단일 실행
pnpm test:watch        # 파일 변경 감지 모드
pnpm test:coverage     # 커버리지 리포트
```

---

## 5. 아키텍처 검증 (Steiger)

**설정 파일**: `steiger.config.ts`

FSD 아키텍처 규칙을 검증합니다.

### 설정

```typescript
export default defineConfig([
  ...fsd.configs.recommended,
  { ignores: ['src/app/**'] }, // App Router 제외
  { ignores: ['src/mocks/**'] }, // 목업 제외
  {
    rules: {
      'fsd/forbidden-imports': 'error',
      'fsd/insignificant-slice': 'off',
      'fsd/no-segmentless-slices': 'warn',
      'fsd/public-api': 'off',
      'fsd/no-public-api-sidestep': 'off',
    },
  },
])
```

### 주요 규칙

| 규칙                    | 레벨    | 설명                        |
| ----------------------- | ------- | --------------------------- |
| `forbidden-imports`     | `error` | 레이어 간 import 규칙 위반  |
| `insignificant-slice`   | `off`   | 작은 슬라이스 허용          |
| `no-segmentless-slices` | `warn`  | 세그먼트 없는 슬라이스 경고 |
| `public-api`            | `off`   | index.ts 필수 규칙 비활성화 |

### 제외 폴더

- `src/app/`: Next.js App Router (FSD 외부)
- `src/mocks/`: MSW 목업 데이터

### 실행

```bash
pnpm fsd
```

---

## 6. 미사용 코드 탐지 (Knip)

**설정 파일**: `knip.config.ts`

사용되지 않는 코드, 의존성, export를 탐지합니다.

### 설정

```typescript
const config: KnipConfig = {
  entry: ['src/app/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/**/*.stories.tsx'],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: ['tailwindcss', 'tsx', 'postcss'],
}
```

| 옵션                 | 값              | 설명                          |
| -------------------- | --------------- | ----------------------------- |
| `entry`              | `src/app/**`    | 진입점 (App Router)           |
| `project`            | `src/**`        | 분석 대상                     |
| `ignore`             | `*.stories.tsx` | Storybook 파일 제외           |
| `ignoreDependencies` | 빌드 도구       | 런타임에 불필요한 의존성 무시 |

### 실행

```bash
pnpm knip
```

### 출력 예시

```
Unused files (2)
  src/shared/lib/deprecated.ts
  src/features/old/OldComponent.tsx

Unused exports (3)
  src/shared/utils.ts: unusedFunction
  src/entities/user/model/types.ts: OldUserType
```

---

## 7. Storybook

### 데코레이터

**설정 파일**: `.storybook/preview-decorators.tsx`

스토리에 공통 컨텍스트를 제공하는 데코레이터:

| 데코레이터               | 용도                     | 사용 레이어               |
| ------------------------ | ------------------------ | ------------------------- |
| `queryProviderDecorator` | QueryClient + Toaster    | 글로벌 (자동 적용)        |
| `mobileDecorator`        | 모바일 프레임 (390×832)  | 페이지 스토리             |
| `mobilePageDecorator`    | 모바일 프레임 + 컨텍스트 | Pages, Form 연동 Features |
| `atomDecorator`          | 고정 너비(390px) + 패딩  | atoms, molecules          |

### 사용 예시

```tsx
// 페이지 스토리
import { mobilePageDecorator } from '@sb/preview'

const meta: Meta<typeof OrderPage> = {
  title: 'pages/order/OrderPage',
  component: OrderPage,
  parameters: { layout: 'fullscreen' },
  decorators: [mobilePageDecorator],
}
```

### MSW 통합

Storybook에서 MSW를 사용하여 API 목업:

```tsx
import { handlers } from '@/mocks/handlers'

export const Default: Story = {
  parameters: {
    msw: { handlers },
  },
}

// 에러 케이스
import { errorHandlers } from '@/mocks/handlers'

export const Error: Story = {
  parameters: {
    msw: { handlers: [errorHandlers.serverError] },
  },
}
```

### 실행

```bash
pnpm storybook         # 개발 서버 (http://localhost:6006)
pnpm build-storybook   # 정적 빌드
```

---

## 빠른 참조

| 명령어               | 설명              |
| -------------------- | ----------------- |
| `pnpm lint`          | ESLint 검사       |
| `pnpm format`        | Prettier 포맷팅   |
| `pnpm gen`           | Plop 코드 생성기  |
| `pnpm test`          | Vitest 테스트     |
| `pnpm test:watch`    | 테스트 watch 모드 |
| `pnpm test:coverage` | 테스트 커버리지   |
| `pnpm fsd`           | FSD 아키텍처 검증 |
| `pnpm knip`          | 미사용 코드 탐지  |
| `pnpm storybook`     | Storybook 실행    |

---

[← 이전: API 모킹](./msw.md)
