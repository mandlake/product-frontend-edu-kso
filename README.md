<div align="center">
  <h1>Next.js FSD Template</h1>
  <p><strong>Feature-Sliced Design 아키텍처 기반 프로덕션 레디 템플릿</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1-000000?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## Features

|                  |                                           |
| ---------------- | ----------------------------------------- |
| **FSD 아키텍처** | 확장 가능한 Feature-Sliced Design 구조    |
| **최신 스택**    | Next.js 16 + React 19 + TypeScript 5      |
| **UI 시스템**    | shadcn/ui + Radix UI + Tailwind CSS 4     |
| **데이터 관리**  | TanStack Query v5 + React Hook Form + Zod |
| **테스트**       | Vitest + Testing Library + MSW            |
| **문서화**       | Storybook 10 + 접근성 테스트              |
| **DX 도구**      | Plop 코드 생성 + Steiger FSD 린터         |
| **보안**         | CSP + 보안 헤더 + ESLint Security         |

---

## Quick Start

```bash
git clone <repo-url>
cd nextjs-fsd-template
pnpm install
pnpm dev          # http://localhost:3000
```

> 상세 설정은 [초기 설정 가이드](./docs/getting-started.md) 참고

---

<details>
<summary><strong>기술 스택 상세</strong></summary>

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

### UI Components

![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000?style=flat-square)
![Radix UI](https://img.shields.io/badge/Radix_UI-latest-161618?style=flat-square)
![Lucide](https://img.shields.io/badge/Lucide_Icons-0.563-F56565?style=flat-square)

### State & Data

![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.71-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.3-3E67B1?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.13-5A29E4?style=flat-square&logo=axios&logoColor=white)

### Testing

![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-16.3-E33332?style=flat-square&logo=testinglibrary&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-2.12-FF6A33?style=flat-square)
![Playwright](https://img.shields.io/badge/Playwright-1.58-45BA4B?style=flat-square&logo=playwright&logoColor=white)

### Documentation

![Storybook](https://img.shields.io/badge/Storybook-10.2-FF4785?style=flat-square&logo=storybook&logoColor=white)

### DevTools

![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.8-F7B93E?style=flat-square&logo=prettier&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-9.1-000?style=flat-square)
![Plop](https://img.shields.io/badge/Plop-4.0-000?style=flat-square)
![Steiger](https://img.shields.io/badge/Steiger-0.5-000?style=flat-square)

</details>

---

<details>
<summary><strong>프로젝트 구조</strong></summary>

```
src/
├── app/              # Next.js App Router (globals.css, layout, pages)
├── widgets/          # 페이지 단위 UI 조합
├── features/         # 사용자 기능 단위
├── entities/         # 도메인 모델, API
│   └── {domain}/
│       ├── api/      # API 함수 + TanStack Query
│       └── model/    # 타입, 스키마
├── shared/
│   ├── ui/
│   │   ├── _base/    # shadcn 원본 컴포넌트
│   │   ├── atoms/    # 기본 컴포넌트 (Text, Checkbox 등)
│   │   ├── molecules/# atoms 조합
│   │   └── organisms/# 복잡한 UI 블록 (ErrorFallback 등)
│   ├── api/          # HTTP 클라이언트, QueryClient
│   ├── lib/          # 유틸리티 (dialog, format, guards, sort)
│   └── providers/    # AppProviders (Query, Dialog, Toaster)
└── mocks/            # MSW 핸들러 + 테스트 데이터
```

</details>

---

## Scripts

| 명령어                 | 설명               |
| ---------------------- | ------------------ |
| `pnpm dev`             | 개발 서버 실행     |
| `pnpm build`           | 프로덕션 빌드      |
| `pnpm build:staging`   | 스테이징 빌드      |
| `pnpm start`           | 프로덕션 서버 실행 |
| `pnpm test`            | 테스트 실행        |
| `pnpm test:watch`      | 테스트 watch 모드  |
| `pnpm test:coverage`   | 테스트 커버리지    |
| `pnpm gen`             | Plop 코드 생성기   |
| `pnpm storybook`       | Storybook 실행     |
| `pnpm build-storybook` | Storybook 빌드     |
| `pnpm lint`            | ESLint 검사        |
| `pnpm format`          | Prettier 포맷팅    |
| `pnpm fsd`             | FSD 아키텍처 검사  |
| `pnpm knip`            | 미사용 코드 탐지   |

---

## Documentation

| 순서 | 문서                                         | 설명                                   |
| ---- | -------------------------------------------- | -------------------------------------- |
| 1    | [초기 설정](./docs/getting-started.md)       | 프로젝트 클론 후 첫 설정               |
| 2    | [아키텍처](./docs/architecture.md)           | FSD 구조, 레이어 규칙, Import 규칙     |
| 3    | [컬러 시스템](./docs/color-system.md)        | CSS Variables + Tailwind v4 테마 설정  |
| 4    | [텍스트 스타일](./docs/text-component.md)    | Text 컴포넌트 Typography variant       |
| 5    | [데이터 흐름](./docs/tanstack-query-flow.md) | TanStack Query SSR/CSR 패턴            |
| 6    | [Dialog & Modal](./docs/dialog-modal.md)     | Imperative Dialog vs Route Modal       |
| 7    | [API 모킹](./docs/msw.md)                    | MSW 핸들러, 테스트 데이터              |
| 8    | [개발 도구](./docs/devtools.md)              | ESLint, Prettier, Husky, Plop, Steiger |

---

## Environment

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```
