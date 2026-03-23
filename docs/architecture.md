# FSD 아키텍처 가이드

> 이 문서의 모든 아키텍처 결정은 각 라이브러리/프레임워크의 **공식 문서와 권장 베스트 프랙티스**에 기반합니다.

[← 이전: 초기 설정](./getting-started.md) | [다음: 컬러 시스템 →](./color-system.md)

## 1. FSD란?

> 🔗 **공식 문서**: [FSD Overview](https://feature-sliced.design/docs) — Feature-Sliced Design 공식 소개. 레이어/슬라이스/세그먼트 개념과 단방향 의존성 원칙.

Feature-Sliced Design은 프론트엔드 코드를 **레이어 → 슬라이스 → 세그먼트** 3단계로 나누는 아키텍처 방법론. 핵심은 **단방향 의존성**: 상위 레이어만 하위 레이어를 import할 수 있음.

```
app  →  widgets  →  features  →  entities  →  shared
(페이지)  (조합)     (기능)       (도메인)     (공용)
```

## 2. 레이어별 역할

> 🔗 **공식 문서**: [FSD Layers](https://feature-sliced.design/docs/reference/layers) — 각 레이어의 공식 정의와 책임 범위.

| 레이어       | 역할                                      | 이 프로젝트 예시                         |
| ------------ | ----------------------------------------- | ---------------------------------------- |
| **app**      | Next.js 라우팅, 레이아웃, 메타데이터, SSR | `app/example/page.tsx`                   |
| **widgets**  | 페이지 단위 UI 조합 + 비즈니스 로직 훅    | `ExampleTodoContent`                     |
| **features** | 사용자 시나리오 단위 기능 (폼, 리스트)    | `TodoForm`, `TodoItem`                   |
| **entities** | 도메인 모델, API 객체, 타입, 쿼리 훅      | `exampleTodoApi`, `useExampleTodoList()` |
| **shared**   | 디자인 시스템, HTTP 클라이언트, 유틸리티  | `Text`, `FormField`, `http`, `cn()`      |

## 3. 의존성 규칙

> 🔗 **공식 문서**: [FSD Layers](https://feature-sliced.design/docs/reference/layers) — 상위 레이어만 하위 레이어를 import할 수 있다는 공식 규칙. [FSD Isolation](https://feature-sliced.design/docs/reference/isolation) — 같은 레이어 내 슬라이스 간 cross-import 금지.

- **단방향만 허용**: `widgets/` → `features/` → `entities/` → `shared/`
- **같은 레이어 내 cross-import 금지**: `entities/order`가 `entities/coupon`을 직접 import할 수 없음
- **Steiger 린터**가 빌드 타임에 위반을 잡아줌 (아래 [7. Steiger 린터](#7-steiger-린터) 참조)

## 4. 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (AppProviders 적용)
│   ├── example/
│   │   └── page.tsx             # Server Component + HydrationBoundary
│   ├── error.tsx
│   └── not-found.tsx
│
├── widgets/                      # 페이지 단위 조합
│   └── example-todo/
│       ├── index.ts                    # export
│       ├── ExampleTodoContent.tsx      # UI 렌더링
│       └── useExampleTodoContent.ts    # 비즈니스 로직
│
├── features/                     # 사용자 기능
│   └── example-todo/
│       ├── ui/
│       │   ├── index.ts         # 세그먼트 내 export
│       │   ├── TodoForm.tsx     # React Hook Form + Zod
│       │   ├── TodoItem.tsx     # 단일 항목 (Checkbox, IconButton)
│       │   └── TodoList.tsx     # 목록
│       ├── lib/
│       │   └── index.ts         # 세그먼트 내 export
│       └── model/
│           ├── index.ts         # 세그먼트 내 export
│           └── schema.ts        # Zod 스키마
│
├── entities/                     # 도메인 모델
│   └── example-todo/
│       ├── api/
│       │   ├── index.ts         # API 객체 (exampleTodoApi)
│       │   └── queries.ts       # queryOptions + Query/Mutation 훅
│       └── model/
│           ├── index.ts         # 세그먼트 내 export
│           └── types.ts         # 네임스페이스 타입
│
├── shared/
│   ├── api/                     # HTTP 클라이언트, QueryClient
│   ├── config/                  # 환경변수, 사이트 설정
│   ├── lib/                     # cn(), JsonLd, dialog, seo
│   ├── providers/               # AppProviders (Query, Theme, MSW)
│   └── ui/
│       ├── _base/              # shadcn/ui 원본 (Radix 래퍼)
│       ├── atoms/              # 디자인 적용 (Text, Checkbox, IconButton)
│       ├── molecules/          # atoms 조합 (FormField)
│       └── organisms/          # ErrorFallback, QueryErrorBoundary, RouteDrawer
│
└── mocks/                       # MSW 핸들러 + 목업 데이터
```

## 5. 레이어별 작성 패턴

> 🔗 **공식 문서**: [FSD Slices and Segments](https://feature-sliced.design/docs/reference/slices-segments) — 슬라이스 내 `ui/`, `model/`, `api/` 등 세그먼트 구조의 공식 가이드.

### Entities: API 객체 + queryOptions + 타입

**타입** — 네임스페이스 패턴으로 그룹핑:

```ts
// entities/example-todo/model/types.ts
export interface ExampleTodo {
  Info: { id: string; title: string; completed: boolean; createdAt: string }
}

export interface ExampleTodoRequest {
  Create: { title: string }
  Update: { title?: string; completed?: boolean }
}
```

사용: `ExampleTodo['Info']`, `ExampleTodoRequest['Create']`

**서브타입 네이밍 가이드:**

| 서브타입  | 용도        | 사용 시점                           |
| --------- | ----------- | ----------------------------------- |
| `Info`    | 기본 정보   | 목록/상세가 같은 필드일 때 (기본값) |
| `Item`    | 목록 아이템 | 목록에서 필요한 필드만 있을 때      |
| `Detail`  | 상세 정보   | 상세 페이지용 추가 필드 있을 때     |
| `Summary` | 요약 정보   | 대시보드, 통계 등                   |

```ts
// 단순한 도메인 — Info 하나로 충분
export interface Todo {
  Info: { id: string; title: string; completed: boolean }
}

// 복잡한 도메인 — Item/Detail 분리
export interface Product {
  Item: { id: string; name: string; price: number; thumbnail: string }
  Detail: {
    id: string
    name: string
    price: number
    description: string
    images: string[]
  }
}

// API에서 사용
getList: () => http.get<Product['Item'][]>('/products')
getById: (id) => http.get<Product['Detail']>(`/products/${id}`)
```

**API 객체** — 단순한 함수 모음:

```ts
// entities/example-todo/api/index.ts
export const exampleTodoApi = {
  getList: () =>
    http.get<ExampleTodo['Info'][]>(BASE_PATH).then((res) => res.data),
  create: (data: ExampleTodoRequest['Create']) =>
    http.post<ExampleTodo['Info']>(BASE_PATH, data).then((res) => res.data),
  // ...
}
```

**queryOptions 팩토리** — prefetch, useQuery, invalidate 모두 같은 객체 사용:

```ts
// entities/example-todo/api/queries.ts
export const exampleTodoQueries = {
  rootKey: ['example-todo'] as const,
  all: () =>
    queryOptions({
      queryKey: [...exampleTodoQueries.rootKey],
      queryFn: exampleTodoApi.getList,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...exampleTodoQueries.rootKey, id],
      queryFn: () => exampleTodoApi.getById(id),
    }),
}

export function useExampleTodoList() {
  return useQuery(exampleTodoQueries.all())
}
export function useCreateExampleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleTodoApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: exampleTodoQueries.rootKey,
      }),
  })
}
```

### Features: UI + Zod 스키마

Feature는 사용자 인터랙션 단위. entities의 훅을 직접 호출하지 않고, props로 핸들러를 받음:

```tsx
// features/example-todo/ui/TodoItem.tsx
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        aria-label={`${todo.title} 완료 여부`}
      />
      <Text
        className={cn(
          'flex-1',
          todo.completed && 'line-through text-muted-foreground'
        )}
      >
        {todo.title}
      </Text>
      <IconButton
        aria-label={`${todo.title} 삭제`}
        variant="destructive"
        size="sm"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 aria-hidden="true" />
      </IconButton>
    </li>
  )
}
```

폼 검증은 Zod 스키마로 처리:

```ts
// features/example-todo/model/schema.ts
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, '할 일을 입력하세요')
    .max(100, '100자 이내로 입력하세요'),
})
```

### Widgets: 비즈니스 로직 훅 + UI 조합

Widget은 **두 파일**로 나뉨:

| 파일                       | 역할                         |
| -------------------------- | ---------------------------- |
| `ExampleTodoContent.tsx`   | UI 렌더링만 (`'use client'`) |
| `useExampleTodoContent.ts` | 상태 관리, 뮤테이션 호출     |

```ts
// widgets/example-todo/.../useExampleTodoContent.ts
export function useExampleTodoContent() {
  const { data: todos = [], isLoading } = useExampleTodoList()
  const createMutation = useCreateExampleTodo()
  // ...
  return {
    todos,
    isLoading,
    isCreating: createMutation.isPending,
    handleCreate,
    handleToggle,
    handleDelete,
  }
}
```

### Shared UI: \_base → atoms → molecules

| 계층         | 역할                              | 예시                                |
| ------------ | --------------------------------- | ----------------------------------- |
| `_base/`     | shadcn/ui 원본 (스타일 거의 없음) | `Button`, `Input`, `Dialog`         |
| `atoms/`     | `_base` 커스텀 + 디자인 토큰 적용 | `Text`, `Checkbox`, `IconButton`    |
| `molecules/` | atoms 조합                        | `FormField` (Label + Input + Error) |

### App: Server Component + metadata

```tsx
// app/example/page.tsx
export const metadata: Metadata = {
  title: 'Todo 예제',
  description: 'FSD + TanStack Query CRUD 예제',
}

export default async function ExamplePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(exampleTodoQueries.all())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Text as="h1" size="2xl" weight="semibold">
          할 일 목록
        </Text>
        <ExampleTodoContent />
      </main>
    </HydrationBoundary>
  )
}
```

## 6. 데이터 흐름

```
Page (Server Component)
  │  prefetchQuery → exampleTodoQueries.all()
  │  dehydrate → HydrationBoundary
  ▼
Widget (Client Component)
  │  useExampleTodoContent() 훅
  │    ├── useExampleTodoList()     ← entities 쿼리 훅
  │    ├── useCreateExampleTodo()   ← entities 뮤테이션 훅
  │    └── handleCreate/Toggle/Delete → mutate()
  ▼
Features (Props 기반)
  │  TodoForm  ← onSubmit prop
  │  TodoItem  ← onToggle, onDelete props
  ▼
Entities (API + TanStack Query)
  │  exampleTodoApi.create() → http.post()
  │  onSuccess → invalidateQueries(rootKey)
  ▼
Shared (Axios, QueryClient)
```

**요약**: Server에서 prefetch → Widget에서 useQuery로 재사용 → Feature는 props로 핸들러 수신 → Entity가 API 호출 + 캐시 관리

## 7. Steiger 린터

> 🔗 **공식 문서**: [Steiger — FSD Linter](https://github.com/feature-sliced/steiger) — FSD 공식 린터. 의존성 방향, cross-import 등 아키텍처 규칙을 정적 분석으로 검증함.

FSD 아키텍처 규칙을 자동 검증하는 린터.

**설정** (`steiger.config.ts`):

```ts
import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  { ignores: ['src/app/**'] }, // Next.js App Router 제외
  { ignores: ['src/mocks/**'] }, // MSW 핸들러 제외
  {
    rules: {
      'fsd/forbidden-imports': 'error', // cross-slice import 금지
      'fsd/insignificant-slice': 'off',
      'fsd/no-segmentless-slices': 'warn',
      'fsd/public-api': 'off',
      'fsd/no-public-api-sidestep': 'off',
    },
  },
])
```

**실행**:

```bash
npx steiger src/
```

## 8. `@x` 디렉토리 패턴 (비권장)

> 🔗 **공식 문서**: [FSD Public API for Cross-Imports](https://feature-sliced.design/docs/reference/public-api#public-api-for-cross-imports) — 같은 레이어 슬라이스 간 cross-import가 불가피할 때 `@x/` 패턴으로 명시적 의존성을 선언하는 공식 가이드.

> **⚠️ 가급적 사용하지 마세요.** 같은 레이어 내 cross-import는 FSD 단방향 의존성 원칙에 위배됩니다. 대부분의 경우 **타입을 상위 레이어(features/widgets)에서 조합**하거나, **공통 타입을 shared로 내리는 것**으로 해결할 수 있습니다. `@x/`는 이런 방법으로도 해결이 안 될 때 **최후의 수단**으로만 사용하세요.

Entity 간 cross-import가 정말 불가피할 때 사용합니다. 예를 들어 `entities/order`가 `entities/coupon`의 타입을 참조해야 하면:

```
entities/
├── coupon/
│   ├── @x/
│   │   └── order.ts      # order 슬라이스가 사용할 수 있는 공개 API
│   └── model/
│       └── types.ts
└── order/
    └── model/
        └── types.ts       # import { Coupon } from '@/entities/coupon/@x/order'
```

`@x/` 폴더는 **특정 슬라이스 전용** 공개 API. "누가 쓰는지"가 파일명으로 명시됨.

**먼저 고려할 대안:**

- 공통 타입이면 `shared/` 레이어로 이동
- 조합이 필요하면 상위 레이어(features/widgets)에서 처리
- `@x/`를 쓰더라도 **타입 export만** 허용하고, 로직 의존은 피할 것

## 9. 새 도메인 추가 체크리스트

`product` 도메인을 추가한다고 가정:

### Entity

- [ ] `entities/product/model/types.ts` — `Product` 네임스페이스 타입 정의
- [ ] `entities/product/model/index.ts` — 세그먼트 내 export
- [ ] `entities/product/api/index.ts` — `productApi` 객체 (CRUD)
- [ ] `entities/product/api/queries.ts` — `productQueries` 팩토리 + Query/Mutation 훅

### Feature

- [ ] `features/product/model/schema.ts` — Zod 스키마
- [ ] `features/product/model/index.ts` — 세그먼트 내 export
- [ ] `features/product/ui/ProductForm.tsx` — 폼 (React Hook Form + Zod)
- [ ] `features/product/ui/ProductItem.tsx` — 리스트 아이템
- [ ] `features/product/ui/index.ts` — 세그먼트 내 export

### Widget

- [ ] `widgets/product/ProductContent.tsx` — `'use client'` UI 컴포넌트
- [ ] `widgets/product/useProductContent.ts` — 비즈니스 로직 훅
- [ ] `widgets/product/index.ts` — export

### Page

- [ ] `app/product/page.tsx` — Server Component + metadata + HydrationBoundary

### Mock (개발용)

- [ ] `mocks/data/product.ts` — 목업 데이터
- [ ] `mocks/handlers/product.ts` — MSW 핸들러
- [ ] `mocks/handlers/index.ts`에 핸들러 등록

### 검증

```bash
npx steiger src/         # FSD 규칙 확인
pnpm build               # 빌드 통과 확인
```

---

## 10. SEO / GEO 설정

### SEO (검색엔진 최적화)

| 파일                 | 역할                                                     |
| -------------------- | -------------------------------------------------------- |
| `app/layout.tsx`     | Metadata export (title, description, openGraph, twitter) |
| `app/robots.ts`      | robots.txt 생성 (크롤러 접근 제어)                       |
| `app/sitemap.ts`     | sitemap.xml 생성 (페이지 목록)                           |
| `shared/lib/seo.tsx` | JSON-LD 헬퍼 컴포넌트                                    |

### GEO (AI 검색엔진 최적화)

AI 검색엔진(ChatGPT, Perplexity, Google AI Overview)이 콘텐츠를 인용 가능한 소스로 선택하게 하는 설정.

#### 언제 적용하는가?

| 프로젝트 유형                  | GEO 적용  | 이유                           |
| ------------------------------ | --------- | ------------------------------ |
| 마케팅/브랜딩 사이트           | ✅ 권장   | AI 검색 노출로 브랜드 인지도 ↑ |
| 기술 블로그, 문서              | ✅ 권장   | 개발자들이 AI로 검색           |
| 이커머스 (상품 페이지)         | ✅ 권장   | AI 쇼핑 추천에 포함            |
| 오픈소스 프로젝트              | ✅ 권장   | 널리 퍼지길 원함               |
| 유료 콘텐츠                    | ❌ 비권장 | AI 학습에 무단 사용 방지       |
| 내부 시스템 (어드민, 인트라넷) | ❌ 금지   | 보안 정보 노출 위험            |
| 저작권 민감 콘텐츠             | ❌ 비권장 | 콘텐츠 도용 우려               |

#### 적용 방법

1. **robots.ts**: AI 봇 명시적 허용 (기본 설정)
2. **JSON-LD**: 구조화 데이터로 콘텐츠 정보 제공

#### 비활성화 방법

내부 시스템은 `app/robots.ts`에서 AI 봇 차단:

```typescript
{ userAgent: 'GPTBot', disallow: '/' },
{ userAgent: 'ClaudeBot', disallow: '/' },
// ...
```

> **주의**: `robots.txt`는 권고 사항일 뿐, 악의적 봇은 무시할 수 있음. 내부 시스템은 인증 + 서버 레벨 차단도 함께 적용할 것.

---

## 공식 문서 레퍼런스

이 문서에서 참조한 공식 문서 및 베스트 프랙티스 출처:

| 주제                   | 공식 문서                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| FSD 아키텍처           | [Feature-Sliced Design](https://feature-sliced.design/docs)                                                          |
| FSD 레이어             | [Layers Reference](https://feature-sliced.design/docs/reference/layers)                                              |
| FSD 슬라이스/세그먼트  | [Slices and Segments](https://feature-sliced.design/docs/reference/slices-segments)                                  |
| FSD Import 규칙        | [Layers](https://feature-sliced.design/docs/reference/layers)                                                        |
| FSD Isolation          | [Isolation](https://feature-sliced.design/docs/reference/isolation)                                                  |
| FSD Cross-Import       | [Public API for Cross-Imports](https://feature-sliced.design/docs/reference/public-api#public-api-for-cross-imports) |
| FSD 린터               | [Steiger](https://github.com/feature-sliced/steiger)                                                                 |
| Next.js App Router     | [Next.js App Router](https://nextjs.org/docs/app)                                                                    |
| TanStack Query SSR     | [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)                  |
| TanStack Query Options | [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options)                             |
| React Hook Form        | [React Hook Form](https://react-hook-form.com)                                                                       |
| Zod 스키마 검증        | [Zod](https://zod.dev)                                                                                               |
| shadcn/ui              | [shadcn/ui](https://ui.shadcn.com/docs)                                                                              |
| Radix UI 접근성        | [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)                                   |

---

[← 이전: 초기 설정](./getting-started.md) | [다음: 컬러 시스템 →](./color-system.md)
