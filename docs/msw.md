# MSW (Mock Service Worker) 가이드

> 이 문서의 모든 패턴은 [MSW 공식 문서](https://mswjs.io/docs)와 [MSW Best Practices](https://mswjs.io/docs/best-practices)에 기반합니다.

[← 이전: 다이얼로그/모달](./dialog-modal.md) | [다음: 개발 도구 →](./devtools.md)

## 1. MSW란?

> 🔗 **공식 문서**: [MSW Introduction](https://mswjs.io/docs) — Mock Service Worker 공식 소개. 네트워크 레벨에서 API를 인터셉트하는 모킹 라이브러리.

MSW는 네트워크 레벨에서 API 요청을 인터셉트하는 모킹 라이브러리. **브라우저에서는 Service Worker**, **Node.js에서는 request interceptor**를 사용함.

**핵심 특징**:

- 별도 프로세스/포트 불필요 (앱 내부에서 네트워크 인터셉트)
- 개발과 테스트에서 **같은 핸들러 공유 가능**
- 실제 네트워크 요청처럼 동작하므로 프로덕션 코드 변경 불필요

## 2. json-server vs MSW

> 🔗 **공식 문서**: [MSW Comparison](https://mswjs.io/docs/comparison) — json-server, Mirage JS 등 다른 모킹 도구와의 비교.

| 항목                    | json-server                       | MSW                           |
| ----------------------- | --------------------------------- | ----------------------------- |
| 실행 방식               | 별도 프로세스 (`npx json-server`) | 앱 내부에서 네트워크 인터셉트 |
| 포트                    | 추가 포트 필요 (3001 등)          | 포트 불필요                   |
| CI 환경                 | 프로세스 관리 필요                | 프로세스 관리 불필요          |
| 테스트 연동             | 별도 서버 띄워야 함               | `setupServer()`로 즉시 사용   |
| 핸들러 로직             | JSON 파일 기반 (로직 제한)        | JavaScript로 자유롭게 작성    |
| 에러 시뮬레이션         | 어려움                            | `server.use()`로 오버라이드   |
| 개발/테스트 핸들러 공유 | 불가능                            | **하나의 핸들러로 공유 가능** |

**결론**: MSW는 개발용 목업과 테스트용 목업을 **하나의 핸들러로 공유**할 수 있음. json-server는 테스트할 때 또 별도 목업을 만들어야 함.

## 3. 프로젝트 구조

```
src/mocks/
├── config.ts               ← MOCK_API_BASE_URL 상수
├── http.ts                 ← withDelay(), errorResponse() 헬퍼
├── browser.ts              ← setupWorker (브라우저 개발용)
├── server.ts               ← setupServer (Node.js 테스트용)
├── index.ts                ← 공개 export
├── data/
│   ├── index.ts
│   └── example-todo.ts     ← 초기 목업 데이터
└── handlers/
    ├── index.ts            ← 전체 핸들러 모음
    └── example-todo.ts     ← CRUD 핸들러 (메모리 DB)
```

| 파일         | 역할                        |
| ------------ | --------------------------- |
| `config.ts`  | API 베이스 URL 상수         |
| `http.ts`    | 응답 헬퍼 (지연, 에러)      |
| `browser.ts` | 브라우저 개발용 worker      |
| `server.ts`  | Node.js 테스트용 server     |
| `data/`      | 목업 데이터 (타입 안전)     |
| `handlers/`  | Request Handler (CRUD 로직) |

## 4. 핵심 개념: Request Handler

> 🔗 **공식 문서**: [MSW http handler](https://mswjs.io/docs/api/http) — `http.get()`, `http.post()` 등 REST 요청 핸들러 작성법.

Handler는 특정 API 요청을 인터셉트하고 응답을 반환하는 함수. `http.get()`, `http.post()` 등으로 정의함.

### 실제 프로젝트 코드

```ts
// src/mocks/handlers/example-todo.ts
import { http, HttpResponse } from 'msw'

import { MOCK_API_BASE_URL } from '@/mocks/config'
import { withDelay, errorResponse } from '@/mocks/http'
import { mockExampleTodos } from '@/mocks/data/example-todo'

import type { ExampleTodo, ExampleTodoRequest } from '@/entities/example-todo'

const BASE_URL = `${MOCK_API_BASE_URL}/example-todo`

// 메모리 DB (CRUD 시뮬레이션)
let todos: ExampleTodo['Info'][] = [...mockExampleTodos]
let nextId = todos.length + 1

export const exampleTodoHandlers = [
  /** 목록 조회 */
  http.get(BASE_URL, async () => {
    await withDelay() // 네트워크 지연 시뮬레이션
    return HttpResponse.json(todos)
  }),

  /** 상세 조회 */
  http.get(`${BASE_URL}/:id`, async ({ params }) => {
    await withDelay()
    const todo = todos.find((t) => t.id === params['id'])

    if (!todo) {
      return errorResponse('NOT_FOUND')
    }

    return HttpResponse.json(todo)
  }),

  /** 생성 */
  http.post(BASE_URL, async ({ request }) => {
    await withDelay()
    const body = (await request.json()) as ExampleTodoRequest['Create']

    const newTodo: ExampleTodo['Info'] = {
      id: String(nextId++),
      title: body.title,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    todos = [newTodo, ...todos] // 목록에 추가
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  /** 수정 */
  http.patch(`${BASE_URL}/:id`, async ({ params, request }) => {
    await withDelay()
    const body = (await request.json()) as ExampleTodoRequest['Update']
    const index = todos.findIndex((t) => t.id === params['id'])

    if (index === -1) {
      return errorResponse('NOT_FOUND') // 에러 응답 팩토리
    }

    const updated: ExampleTodo['Info'] = { ...todos[index]!, ...body }
    todos = todos.map((t) => (t.id === params['id'] ? updated : t))

    return HttpResponse.json(updated)
  }),

  /** 삭제 */
  http.delete(`${BASE_URL}/:id`, async ({ params }) => {
    await withDelay()
    const exists = todos.some((t) => t.id === params['id'])

    if (!exists) {
      return errorResponse('NOT_FOUND')
    }

    todos = todos.filter((t) => t.id !== params['id'])
    return new HttpResponse(null, { status: 204 })
  }),
]
```

**핵심 포인트**:

- `let todos` 메모리 DB로 CRUD 시뮬레이션
- `withDelay()`로 네트워크 지연 시뮬레이션 (기본 50ms) → 로딩 UI 확인 가능
- `errorResponse('NOT_FOUND')`로 에러 응답 팩토리 사용
- 타입 안전: request body를 `as ExampleTodoRequest['Create']`로 타입 단언

## 5. 응답 헬퍼

> 🔗 **공식 문서**: [MSW HttpResponse](https://mswjs.io/docs/api/http-response) — JSON, XML, delay 등 응답 생성 API.

`withDelay()`와 `errorResponse()`는 프로젝트 공통 헬퍼:

```ts
// src/mocks/http.ts
import { delay, HttpResponse } from 'msw'

/** Mock 응답 기본 지연 시간 (ms) */
const DEFAULT_DELAY = 50

/** Mock 에러 응답 템플릿 */
const ERROR_RESPONSES = {
  BAD_REQUEST: { status: 400, message: '잘못된 요청입니다.' },
  UNAUTHORIZED: { status: 401, message: '인증이 필요합니다.' },
  FORBIDDEN: { status: 403, message: '접근 권한이 없습니다.' },
  NOT_FOUND: { status: 404, message: '요청한 리소스를 찾을 수 없습니다.' },
  SERVER_ERROR: { status: 500, message: '서버 오류가 발생했습니다.' },
} as const

type ErrorType = keyof typeof ERROR_RESPONSES

/** 지연 응답 헬퍼 */
export async function withDelay(ms = DEFAULT_DELAY) {
  await delay(ms)
}

/** 에러 응답 팩토리 */
export function errorResponse(type: ErrorType) {
  const error = ERROR_RESPONSES[type]

  return HttpResponse.json({ message: error.message }, { status: error.status })
}
```

**사용 예시**:

```ts
// 정상 응답 (300ms 지연)
await withDelay()
return HttpResponse.json(data)

// 커스텀 지연
await withDelay(1000)

// 에러 응답
if (!item) {
  return errorResponse('NOT_FOUND')
}
```

## 6. 브라우저 vs Node.js 셋업

> 🔗 **공식 문서**: [MSW setupWorker](https://mswjs.io/docs/api/setup-worker) — 브라우저 환경에서 Service Worker를 통한 요청 인터셉트. [MSW setupServer](https://mswjs.io/docs/api/setup-server) — Node.js 환경에서 요청 인터셉트 (테스트용).

| 환경     | 파일         | API             | 용도                   |
| -------- | ------------ | --------------- | ---------------------- |
| 브라우저 | `browser.ts` | `setupWorker()` | 개발 서버에서 API 목업 |
| Node.js  | `server.ts`  | `setupServer()` | Vitest 테스트          |

**중요**: 두 환경 모두 **같은 `handlers`를 import**함. 이것이 MSW의 강점 — 개발과 테스트에서 하나의 핸들러 세트를 공유.

### 코드

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

```ts
// src/mocks/server.ts
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

```ts
// src/mocks/handlers/index.ts
import { exampleTodoHandlers } from './example-todo'

import type { RequestHandler } from 'msw'

export const handlers: RequestHandler[] = [...exampleTodoHandlers]
```

### 브라우저 사용 (개발 서버)

```tsx
// shared/providers/msw-provider.tsx
'use client'

import { useEffect, useState } from 'react'

const isDev = process.env.NODE_ENV === 'development'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(!isDev)

  useEffect(() => {
    if (!isDev) return

    async function initMSW() {
      const { worker } = await import('@/mocks/browser')
      await worker.start({
        onUnhandledRequest(request, print) {
          const url = new URL(request.url)

          // Next.js 내부 요청은 무시 (에러 로그 방지)
          const isNextInternal =
            url.pathname.startsWith('/_next/') ||
            url.pathname.includes('__nextjs')

          if (isNextInternal) return
          print.warning()
        },
      })
      setIsReady(true)
    }

    initMSW()
  }, [])

  if (!isReady) return null
  return <>{children}</>
}
```

`shared/providers/index.tsx`의 `AppProviders`에서 `MSWProvider`로 감싸서 적용:

```tsx
// shared/providers/index.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster />
          <DialogProvider />
        </ThemeProvider>
      </QueryProvider>
    </MSWProvider>
  )
}
```

## 7. 테스트에서 사용하기

> 🔗 **공식 문서**: [MSW Network Behavior Overrides](https://mswjs.io/docs/best-practices/network-behavior-overrides) — `server.use()`로 테스트별 응답 오버라이드 (공식 베스트 프랙티스). [MSW Structuring Handlers](https://mswjs.io/docs/best-practices/structuring-handlers) — 핸들러 구조화 베스트 프랙티스.

### 7.1 기본 패턴 (3줄 셋업)

**모든 테스트 파일에서 동일한 셋업**:

```ts
import { setupServer } from 'msw/node'
import { beforeAll, afterEach, afterAll } from 'vitest'

// 기본 핸들러로 서버 생성
const server = setupServer(
  http.get('/api/todos', () => HttpResponse.json(mockTodos))
  // ... 다른 핸들러
)

beforeAll(() => server.listen()) // 인터셉트 시작
afterEach(() => server.resetHandlers()) // 오버라이드 초기화
afterAll(() => server.close()) // 인터셉트 종료
```

**왜 3줄이 필요한가?**

| 훅            | 역할                                               |
| ------------- | -------------------------------------------------- |
| `beforeAll()` | 테스트 시작 전 MSW 서버 활성화                     |
| `afterEach()` | 각 테스트 후 `server.use()`로 추가된 핸들러 초기화 |
| `afterAll()`  | 모든 테스트 종료 후 MSW 서버 닫기                  |

### 7.2 에러 시뮬레이션 (server.use)

테스트에서 특정 응답을 오버라이드하려면 `server.use()` 사용:

```ts
import { http, HttpResponse } from 'msw'

it('API 에러 시 빈 목록을 유지한다', async () => {
  // 이 테스트에서만 에러 응답으로 오버라이드
  server.use(
    http.get(TODO_ENDPOINT, () =>
      HttpResponse.json({ message: 'Server Error' }, { status: 500 })
    )
  )

  const { result } = renderHook(() => useExampleTodoContent(), {
    wrapper: createQueryWrapper(),
  })

  await vi.waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })

  expect(result.current.todos).toEqual([])
})
```

**핵심**: `server.use()`는 해당 테스트에서만 적용되고, `afterEach()`의 `resetHandlers()`로 원래 핸들러로 복원됨.

### 7.3 실제 테스트 전체 예시

```ts
// src/widgets/example-todo/.../useExampleTodoContent.test.ts
import { renderHook, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { createQueryWrapper } from '@/mocks/create-query-wrapper'

import { useExampleTodoContent } from './useExampleTodoContent'

import type { ExampleTodo } from '@/entities/example-todo'

// 환경변수 모킹
vi.mock('@/shared/config/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
    API_BASE_URL: 'http://localhost:3001',
  },
}))

const TODO_ENDPOINT = 'http://localhost:3001/example-todo'

const mockTodos: ExampleTodo['Info'][] = [
  {
    id: '1',
    title: '장보기',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: '운동하기',
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
  },
]

// 테스트용 MSW 서버 (모든 CRUD 핸들러)
const server = setupServer(
  http.get(TODO_ENDPOINT, () => HttpResponse.json(mockTodos)),
  http.post(TODO_ENDPOINT, () =>
    HttpResponse.json({ id: '3', title: '공부하기', completed: false })
  ),
  http.patch(`${TODO_ENDPOINT}/:id`, () =>
    HttpResponse.json({ id: '1', title: '장보기', completed: true })
  ),
  http.delete(
    `${TODO_ENDPOINT}/:id`,
    () => new HttpResponse(null, { status: 204 })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useExampleTodoContent', () => {
  it('초기 상태는 로딩이다', () => {
    const { result } = renderHook(() => useExampleTodoContent(), {
      wrapper: createQueryWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.todos).toEqual([])
  })

  it('할 일 목록을 가져온다', async () => {
    const { result } = renderHook(() => useExampleTodoContent(), {
      wrapper: createQueryWrapper(),
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.todos).toHaveLength(2)
    expect(result.current.todos[0]?.title).toBe('장보기')
    expect(result.current.todos[1]?.completed).toBe(true)
  })

  it('handleCreate가 새 항목을 추가한다', async () => {
    const { result } = renderHook(() => useExampleTodoContent(), {
      wrapper: createQueryWrapper(),
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.handleCreate({ title: '공부하기' })
    })

    // mutation 완료 대기
    await vi.waitFor(() => {
      expect(result.current.isCreating).toBe(false)
    })
  })

  it('API 에러 시 빈 목록을 유지한다', async () => {
    // 에러 응답으로 오버라이드
    server.use(
      http.get(TODO_ENDPOINT, () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 })
      )
    )

    const { result } = renderHook(() => useExampleTodoContent(), {
      wrapper: createQueryWrapper(),
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.todos).toEqual([])
  })
})
```

## 8. 새 핸들러 추가 체크리스트

`product` 도메인을 추가한다고 가정:

### Entity 타입 정의

- [ ] `entities/product/model/types.ts` — `Product` 네임스페이스 타입 정의

```ts
export interface Product {
  Info: { id: string; name: string; price: number }
}

export interface ProductRequest {
  Create: { name: string; price: number }
  Update: Partial<Product['Info']>
}
```

### Mock 데이터

- [ ] `mocks/data/product.ts` — 초기 목업 데이터 정의

```ts
import type { Product } from '@/entities/product'

export const mockProducts: Product['Info'][] = [
  { id: '1', name: '노트북', price: 1200000 },
  { id: '2', name: '마우스', price: 30000 },
]
```

- [ ] `mocks/data/index.ts` — 데이터 export 추가

```ts
export { mockProducts } from './product'
```

### Handler 작성

- [ ] `mocks/handlers/product.ts` — CRUD 핸들러 작성

```ts
import { http, HttpResponse } from 'msw'

import { MOCK_API_BASE_URL } from '@/mocks/config'
import { withDelay, errorResponse } from '@/mocks/http'
import { mockProducts } from '@/mocks/data/product'

import type { Product, ProductRequest } from '@/entities/product'

const BASE_URL = `${MOCK_API_BASE_URL}/products`

let products: Product['Info'][] = [...mockProducts]
let nextId = products.length + 1

export const productHandlers = [
  http.get(BASE_URL, async () => {
    await withDelay()
    return HttpResponse.json(products)
  }),

  http.post(BASE_URL, async ({ request }) => {
    await withDelay()
    const body = (await request.json()) as ProductRequest['Create']
    const newProduct: Product['Info'] = { id: String(nextId++), ...body }
    products = [newProduct, ...products]
    return HttpResponse.json(newProduct, { status: 201 })
  }),

  // ... patch, delete 추가
]
```

- [ ] `mocks/handlers/index.ts` — 핸들러 배열에 등록

```ts
import { exampleTodoHandlers } from './example-todo'
import { productHandlers } from './product'

import type { RequestHandler } from 'msw'

export const handlers: RequestHandler[] = [
  ...exampleTodoHandlers,
  ...productHandlers,
]
```

### 검증

```bash
# 개발 서버 확인
pnpm dev
# 브라우저 Network 탭에서 MSW 인터셉트 확인

# 테스트 확인
pnpm test
```

## 9. 베스트 프랙티스

| 원칙                               | 설명                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Happy Path를 기본 핸들러로         | `handlers/`에는 성공 응답만. 에러는 테스트에서 `server.use()`로 오버라이드 |
| 메모리 DB 패턴                     | `let items = [...]`로 상태를 유지하면 CRUD 시뮬레이션 가능                 |
| withDelay로 로딩 UI 확인           | 개발 시 네트워크 지연을 시뮬레이션해서 Skeleton/Spinner 검증               |
| errorResponse 팩토리               | 에러 응답을 Map으로 관리하면 일관된 에러 형식 보장                         |
| 핸들러 공유                        | 개발(browser.ts)과 테스트(server.ts) 모두 같은 handlers를 사용             |
| 타입 안전성                        | request body를 `as ProductRequest['Create']`로 타입 단언                   |
| 초기 데이터 분리                   | `mocks/data/`에 별도 파일로 관리 (JSDoc 주석 필수)                         |
| 하나의 도메인 = 하나의 핸들러 파일 | `handlers/product.ts`, `handlers/order.ts` 등으로 분리                     |

### 안티패턴

```ts
// ❌ 핸들러에 에러 로직 섞지 않기
http.get('/api/todos', () => {
  if (Math.random() > 0.5) {
    return HttpResponse.json({ error: 'Random error' }, { status: 500 })
  }
  return HttpResponse.json(todos)
})

// ✅ 기본은 성공, 테스트에서 server.use()로 오버라이드
http.get('/api/todos', () => HttpResponse.json(todos))
```

```ts
// ❌ delay() 직접 호출
await delay(500)

// ✅ withDelay() 헬퍼 사용
await withDelay(500)
```

```ts
// ❌ 에러 응답 하드코딩
return HttpResponse.json({ message: 'Not Found' }, { status: 404 })

// ✅ errorResponse 팩토리 사용
return errorResponse('NOT_FOUND')
```

## 10. 트러블슈팅

### 브라우저에서 MSW가 작동하지 않음

```bash
# public/mockServiceWorker.js 생성
npx msw init public/ --save
```

### 테스트에서 실제 API 호출됨

```ts
// beforeAll에서 server.listen() 누락
beforeAll(() => server.listen())

// onUnhandledRequest 옵션 추가
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
```

### 오버라이드가 다음 테스트에 영향

```ts
// afterEach에서 resetHandlers() 누락
afterEach(() => server.resetHandlers())
```

### 환경변수 모킹 필요

```ts
// 테스트 상단에 환경변수 모킹
vi.mock('@/shared/config/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
  },
}))
```

## 11. 요약

MSW는 **네트워크 레벨에서 API를 인터셉트**하는 모킹 라이브러리. 개발과 테스트에서 **같은 핸들러를 공유**할 수 있으며, 별도 프로세스/포트가 필요 없음.

**핵심 패턴**:

1. `handlers/` — 도메인별 CRUD 핸들러 작성 (메모리 DB 패턴)
2. `data/` — 초기 목업 데이터 타입 안전하게 정의
3. `browser.ts` — 개발 서버용 (setupWorker)
4. `server.ts` — 테스트용 (setupServer)
5. 테스트 3줄 셋업 — `beforeAll`, `afterEach`, `afterAll`
6. `server.use()` — 테스트별 에러 시뮬레이션

**개발 흐름**:

```
Entity 타입 정의 → Mock 데이터 생성 → Handler 작성 → handlers/index.ts 등록 → 테스트 작성
```

---

## 공식 문서 레퍼런스

이 문서에서 참조한 공식 문서 및 베스트 프랙티스 출처:

| 주제                  | 공식 문서                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------- |
| MSW 소개              | [MSW Introduction](https://mswjs.io/docs)                                                     |
| MSW vs 다른 도구 비교 | [MSW Comparison](https://mswjs.io/docs/comparison)                                            |
| HTTP 핸들러           | [MSW http handler](https://mswjs.io/docs/api/http)                                            |
| 응답 생성             | [MSW HttpResponse](https://mswjs.io/docs/api/http-response)                                   |
| 브라우저 Worker       | [MSW setupWorker](https://mswjs.io/docs/api/setup-worker)                                     |
| Node.js Server        | [MSW setupServer](https://mswjs.io/docs/api/setup-server)                                     |
| 핸들러 오버라이드     | [Network Behavior Overrides](https://mswjs.io/docs/best-practices/network-behavior-overrides) |
| 핸들러 구조화         | [Structuring Handlers](https://mswjs.io/docs/best-practices/structuring-handlers)             |
| Vitest 테스트 환경    | [Vitest](https://vitest.dev)                                                                  |
| Testing Library       | [Testing Library](https://testing-library.com/docs/)                                          |

---

[← 이전: 다이얼로그/모달](./dialog-modal.md) | [다음: 개발 도구 →](./devtools.md)
