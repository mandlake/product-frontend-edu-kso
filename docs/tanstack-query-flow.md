# TanStack Query — 세팅 & 데이터 플로우

> 프로젝트에 설정된 TanStack Query v5의 구조와 데이터 흐름.
>
> 이 문서의 모든 패턴은 [TanStack Query v5 공식 문서](https://tanstack.com/query/v5/docs/framework/react/overview)와 공식 가이드의 베스트 프랙티스에 기반합니다. SSR 패턴은 [Advanced Server Rendering 공식 가이드](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)를 따릅니다.

[← 이전: 텍스트 스타일](./text-component.md) | [다음: 다이얼로그/모달 →](./dialog-modal.md)

---

## 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│  shared/providers/                                       │
│  QueryClientProvider + getQueryClient()                  │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌─────────────────┐            ┌──────────────────┐
│  Server (SSR)   │            │  Client (CSR)    │
│  page.tsx       │            │  Widget.tsx      │
│                 │            │                  │
│  prefetchQuery()│──hydrate──▶│  useQuery()      │
│  dehydrate()    │            │  useMutation()   │
└─────────────────┘            └──────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  entities/api     │
                              │  queryOptions()   │
                              │  exampleTodoApi   │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  shared/api       │
                              │  http (Axios)     │
                              │  ApiError         │
                              └──────────────────┘
```

---

## 인프라 레이어 — 파일별 역할

| 파일                         | 역할               | 한줄 요약                                      |
| ---------------------------- | ------------------ | ---------------------------------------------- |
| `shared/api/http.ts`         | Axios 인스턴스     | 서버/클라이언트 baseURL 분기 + 에러 인터셉터   |
| `shared/api/error.ts`        | ApiError 클래스    | 에러 타입 분류 (network / http) + retry 판단   |
| `shared/api/query-client.ts` | QueryClient 팩토리 | 서버/클라이언트 분리 + retry/toast 글로벌 설정 |
| `shared/providers/`          | Provider 래핑      | QueryClientProvider + Theme + Devtools         |

---

## Axios 인스턴스 (`shared/api/http.ts`)

```ts
const isServer = typeof window === 'undefined'

export const http = axios.create({
  baseURL: isServer ? env.API_BASE_URL : env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
})
```

### 응답 인터셉터 — 모든 에러를 ApiError로 변환

```ts
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError({ type: 'network', message: '네트워크 오류' })
      )
    }
    const { status, data } = error.response
    return Promise.reject(
      new ApiError({ type: 'http', message: data?.message, status, data })
    )
  }
)
```

→ 이후 모든 코드에서 `isApiError(error)` 하나로 타입 안전하게 처리 가능

---

## ApiError 클래스 (`shared/api/error.ts`)

```ts
class ApiError extends Error {
  readonly type: 'network' | 'http'
  readonly status: number | undefined

  get isRetryable() {
    return this.isNetworkError || this.isServerError
  }
  get isNetworkError() {
    return this.type === 'network'
  }
  get isServerError() {
    return this.status !== undefined && this.status >= 500
  }
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }
  get isUnauthorized() {
    return this.status === 401
  }
  get isNotFound() {
    return this.status === 404
  }
}
```

**재시도 판단 기준**:

```
에러 발생
  ├── 네트워크 에러 (응답 없음) → isRetryable = true  → 재시도
  ├── 500+ 서버 에러            → isRetryable = true  → 재시도
  └── 400 클라이언트 에러       → isRetryable = false → 재시도 안 함
       ├── 401 Unauthorized
       ├── 404 Not Found
       └── 기타 4xx
```

---

## QueryClient 설정 (`shared/api/query-client.ts`)

> 🔗 **공식 문서**: [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr) — 서버/클라이언트 QueryClient 분리 패턴. 서버에서 매번 새 인스턴스를 생성하고, 클라이언트에서 싱글톤을 유지하는 것이 공식 권장 방식임. [MutationCache](https://tanstack.com/query/v5/docs/reference/MutationCache) — `onError` 글로벌 콜백으로 뮤테이션 에러를 한 곳에서 처리.

```ts
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1분간 fresh → refetch 안 함
        gcTime: 300_000, // 5분 후 미사용 캐시 제거
        retry: (failureCount, error) => {
          if (isApiError(error) && error.isRetryable) {
            return failureCount < 2 // 최대 2회 재시도
          }
          return false // 400 에러 등은 재시도 안 함
        },
        retryDelay: (
          attempt // 지수 백오프: 1초 → 2초 → 4초 (최대 30초)
        ) => Math.min(1000 * 2 ** attempt, 30_000),
        refetchOnWindowFocus: false, // 탭 포커스 시 refetch 비활성화
      },
      mutations: {
        retry: false, // 뮤테이션은 재시도 안 함
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        // 뮤테이션 에러 → 글로벌 toast
        if (isServer) return
        toast.error(isApiError(error) ? error.message : '요청 처리 중 오류')
      },
    }),
  })
}
```

### 서버/클라이언트 분리

```ts
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) return makeQueryClient() // 서버: 매 요청마다 새로 생성
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient() // 클라이언트: 싱글톤
  }
  return browserQueryClient
}
```

**왜 분리하는가?**

- 서버에서 싱글톤 쓰면 → A 유저 캐시를 B 유저가 볼 수 있음
- 클라이언트에서 매번 생성하면 → 페이지 이동 시 캐시 날아감

---

## Provider 설정 (`shared/providers/`)

Provider는 역할별로 분리되어 있습니다:

```
shared/providers/
├── index.tsx              # AppProviders (조합)
├── query-provider.tsx     # QueryClientProvider + Devtools
├── theme-provider.tsx     # next-themes
├── dialog-provider.tsx    # Imperative Dialog (useDialog)
├── msw-provider.tsx       # MSW (개발 환경 전용)
└── dialog-items/          # Dialog 타입별 컴포넌트
```

```tsx
// shared/providers/query-provider.tsx
'use client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient() // 클라이언트 싱글톤

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

// shared/providers/index.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster /> {/* 뮤테이션 에러 toast 표시 */}
          <DialogProvider /> {/* Imperative Dialog */}
        </ThemeProvider>
      </QueryProvider>
    </MSWProvider>
  )
}
```

`app/layout.tsx`에서 `<AppProviders>{children}</AppProviders>`로 감싸서 전체 앱에 적용

> Dialog 시스템에 대한 자세한 내용은 [다이얼로그/모달 가이드](./dialog-modal.md)를 참고하세요.

---

## Entity API 레이어 — 도메인별 세팅

### API 객체 (`entities/example-todo/api/index.ts`)

```ts
export const exampleTodoApi = {
  getList: () =>
    http.get<ExampleTodo['Info'][]>('/example-todo').then((res) => res.data),
  getById: (id: string) =>
    http
      .get<ExampleTodo['Info']>(`/example-todo/${id}`)
      .then((res) => res.data),
  create: (data) =>
    http
      .post<ExampleTodo['Info']>('/example-todo', data)
      .then((res) => res.data),
  update: (id, data) =>
    http
      .patch<ExampleTodo['Info']>(`/example-todo/${id}`, data)
      .then((res) => res.data),
  delete: (id: string) => http.delete(`/example-todo/${id}`),
}
```

### queryOptions 팩토리 (`entities/example-todo/api/queries.ts`)

> 🔗 **공식 문서**: [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options) — `queryOptions` 헬퍼는 queryKey와 queryFn을 한 곳에 co-locate하는 공식 권장 방식. `useQuery`, `useSuspenseQuery`, `prefetchQuery`, `setQueryData` 등 여러 곳에서 같은 객체를 재사용할 수 있음.

```ts
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
      enabled: !!id,
    }),
}
```

**이 객체 하나로 3가지를 처리:**

| 용도            | 코드                                                          |
| --------------- | ------------------------------------------------------------- |
| SSR prefetch    | `queryClient.prefetchQuery(exampleTodoQueries.all())`         |
| 클라이언트 조회 | `useQuery(exampleTodoQueries.all())`                          |
| 캐시 무효화     | `invalidateQueries({ queryKey: exampleTodoQueries.rootKey })` |

---

## Query 훅 + Mutation 훅

> 🔗 **공식 문서**: [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options) — queryOptions 팩토리에서 정의한 객체를 `useQuery()`에 그대로 전달하는 패턴. [Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations) — `useMutation`의 `onSuccess`에서 `invalidateQueries`를 호출하여 관련 쿼리를 자동 갱신.

### Query 훅 — 데이터 조회

```ts
export function useExampleTodoList() {
  return useQuery(exampleTodoQueries.all())
}

export function useExampleTodo(id: string) {
  return useQuery(exampleTodoQueries.detail(id))
}
```

### Mutation 훅 — 데이터 변경 + 자동 캐시 무효화

```ts
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

export function useUpdateExampleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => exampleTodoApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: exampleTodoQueries.rootKey,
      }),
  })
}

export function useDeleteExampleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: exampleTodoApi.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: exampleTodoQueries.rootKey,
      }),
  })
}
```

### onSuccess vs onSettled 선택 기준

| 콜백        | 호출 시점      | 사용 케이스               |
| ----------- | -------------- | ------------------------- |
| `onSuccess` | 성공 시에만    | 일반 CRUD (기본값)        |
| `onSettled` | 성공/실패 모두 | 결제, 송금, 외부 API 연동 |

**기본: `onSuccess`** — 일반 CRUD 작업은 실패 = 서버에서도 처리 안 됨이 확실하므로 성공 시에만 캐시 갱신.

**`onSettled` 사용 케이스**:

- 결제/송금 — 타임아웃이어도 서버에서 처리됐을 수 있음
- 외부 API 연동 — 응답 지연이 잦은 서비스
- 멱등하지 않은 작업 — 재시도하면 중복 처리 위험

```ts
// 결제처럼 타임아웃이어도 서버에서 처리됐을 수 있는 경우
export function useProcessPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.process,
    onSettled: () =>
      // 실패해도 서버 상태 확인
      queryClient.invalidateQueries({ queryKey: paymentQueries.rootKey }),
  })
}
```

---

## SSR 데이터 플로우

> 🔗 **공식 문서**: [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr) — Next.js App Router에서 `prefetchQuery` + `dehydrate` + `HydrationBoundary`로 서버 캐시를 클라이언트에 전달하는 것이 공식 권장 SSR 패턴임. `initialData` 대신 이 방식을 사용해야 staleTime이 정상 작동함.

### 1단계: Server Component에서 prefetch (`app/example/page.tsx`)

```tsx
export default async function ExamplePage() {
  // ① 서버 전용 QueryClient 생성
  const queryClient = getQueryClient()

  // ② 서버에서 데이터 prefetch (캐시에 저장됨)
  await queryClient.prefetchQuery(exampleTodoQueries.all())

  // ③ 캐시를 직렬화해서 클라이언트로 전달
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExampleTodoContent /> {/* 클라이언트 위젯 */}
    </HydrationBoundary>
  )
}
```

### 2단계: Client Component에서 재사용

```tsx
// widgets/example-todo/.../useExampleTodoContent.ts
export function useExampleTodoContent() {
  const { data: todos = [], isLoading } = useExampleTodoList() // ④ 캐시 히트 → 즉시 반환
  const createMutation = useCreateExampleTodo()
  // ...
}
```

### 전체 흐름도

```
서버                                        클라이언트
─────                                       ─────────
① getQueryClient()
   → 새 QueryClient 생성

② prefetchQuery(exampleTodoQueries.all())
   → http.get('/example-todo')
   → 응답 데이터를 캐시에 저장

③ dehydrate(queryClient)
   → 캐시를 JSON으로 직렬화
   → HydrationBoundary로 전달
                                            ④ HydrationBoundary
                     ─── HTML + 캐시 JSON ──▶   → 캐시를 클라이언트 QueryClient에 주입

                                            ⑤ useQuery(exampleTodoQueries.all())
                                               → 캐시 히트! → 네트워크 요청 없이 즉시 반환
                                               → staleTime(1분) 후 백그라운드 refetch
```

---

## Mutation 플로우 (생성 예시)

> 🔗 **공식 문서**: [Invalidation from Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations) — mutation 성공 시 `invalidateQueries`로 관련 쿼리를 무효화하는 것이 공식 권장 패턴. rootKey로 invalidate하면 해당 키 하위의 모든 쿼리가 자동 refetch됨.

```
사용자: "할 일 추가" 버튼 클릭
  │
  ▼
Widget (useExampleTodoContent)
  │  handleCreate({ title: '장보기' })
  │  → createMutation.mutate({ title: '장보기' })
  │
  ▼
Entity (useCreateExampleTodo)
  │  mutationFn: exampleTodoApi.create({ title: '장보기' })
  │  → http.post('/example-todo', { title: '장보기' })
  │
  ├── 성공 시:
  │     onSuccess → invalidateQueries({ queryKey: ['example-todo'] })
  │                 → useExampleTodoList() 자동 refetch
  │                 → UI 업데이트 (새 항목 표시)
  │
  └── 실패 시:
        MutationCache.onError → toast.error('에러 메시지')
        (글로벌 처리 — 개별 에러 핸들링 불필요)
```

---

## 에러 처리 플로우

```
API 요청 실패
  │
  ▼
Axios 인터셉터 (http.ts)
  │  → AxiosError를 ApiError로 변환
  │     ├── 응답 없음 → ApiError({ type: 'network' })
  │     └── 응답 있음 → ApiError({ type: 'http', status: 500 })
  │
  ├── Query 에러:
  │     QueryClient retry 로직 판단
  │     ├── isRetryable = true (network, 500+)
  │     │     → 최대 2회 재시도 (지수 백오프: 1s → 2s → 4s)
  │     └── isRetryable = false (400, 401, 404...)
  │           → 즉시 실패
  │
  └── Mutation 에러:
        retry 안 함 (항상 즉시 실패)
        → MutationCache.onError
        → toast.error(에러 메시지)
```

---

## fetchQuery vs prefetchQuery

|                           | `fetchQuery`                       | `prefetchQuery`     |
| ------------------------- | ---------------------------------- | ------------------- |
| 반환값                    | `Promise<TData>` (데이터)          | `Promise<void>`     |
| 캐시 저장                 | O                                  | O                   |
| 서버에서 데이터 직접 사용 | O                                  | X                   |
| 사용 시점                 | 서버에서 렌더링에 데이터 필요할 때 | 캐시만 채우면 될 때 |

---

## 왜 initialData가 아니라 HydrationBoundary인가

> 🔗 **공식 문서**: [Advanced Server Rendering — Using the Hydration APIs](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr) — 공식 문서에서 `initialData`의 한계를 명시하고 Hydration API를 권장함. `initialData`는 캐시에 영구 저장되어 staleTime을 무시하는 문제가 있음.

### ❌ initialData 방식 (사용 금지)

```tsx
// 문제: 캐시에 영구 저장 → staleTime 무시됨
const todos = await todoApi.getList()
return <TodoList initialData={todos} />

function TodoList({ initialData }) {
  const { data } = useQuery({ ...todoQueries.all(), initialData })
  // initialData는 항상 fresh 취급 → 백그라운드 refetch 안 됨
}
```

### ✅ HydrationBoundary 방식 (권장)

```tsx
// 캐시를 "수화"하는 방식 → staleTime 정상 작동
const queryClient = getQueryClient()
await queryClient.prefetchQuery(todoQueries.all())

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <TodoList /> {/* useQuery()가 캐시에서 읽고, staleTime 후 refetch */}
  </HydrationBoundary>
)
```

|                          | initialData           | HydrationBoundary     |
| ------------------------ | --------------------- | --------------------- |
| 캐시 저장                | 영구 (staleTime 무시) | 정상 (staleTime 적용) |
| 백그라운드 refetch       | 안 됨                 | 됨                    |
| TanStack Query 공식 권장 | X                     | O                     |

---

## 캐시 타이밍 시각화

> 🔗 **공식 문서**: [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults) — `staleTime` 기본값은 0 (즉시 stale), `gcTime` 기본값은 5분. 이 프로젝트는 staleTime을 1분으로 설정하여 불필요한 refetch를 줄임.

```
0초          1분                    5분
│            │                      │
├── fetch ──▶├── stale ────────────▶├── GC (캐시 제거)
│   fresh    │   백그라운드 refetch  │
│   (캐시)    │   가능               │
│            │                      │
│  useQuery  │  useQuery            │  useQuery
│  → 캐시 히트│  → 캐시 반환 +       │  → 새로 fetch
│  → 요청 X  │    백그라운드 refetch │
```

- **staleTime (1분)**: 이 시간 동안은 캐시가 "신선" → refetch 안 함
- **gcTime (5분)**: 이 시간 후 미사용 캐시 삭제 → 다음 접근 시 새로 fetch

---

## 테스트 패턴 — Query 훅 + MSW

> 🔗 **공식 문서**: [Testing](https://tanstack.com/query/v5/docs/framework/react/guides/testing) — 공식 문서에서 테스트마다 새 QueryClient를 생성하고, `retry: false`로 설정하는 것을 명시적으로 권장함. 재시도를 끄지 않으면 에러 테스트에서 타임아웃이 발생함.

**격리된 QueryClient + MSW 네트워크 인터셉트** 패턴을 따름.

### createQueryWrapper — 테스트 전용 Provider

```ts
// mocks/create-query-wrapper.ts
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // 테스트에서 재시도하면 느려짐
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}
```

**포인트**:

- 매 호출마다 새 QueryClient 생성 → 테스트 간 캐시 격리
- retry: false → 실패 테스트가 재시도 기다리느라 느려지는 거 방지

### MSW 서버 세팅

```ts
// useExampleTodoContent.test.ts

// ① 환경변수 모킹 (t3-oss 런타임 검증 우회)
vi.mock('@/shared/config/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
    API_BASE_URL: 'http://localhost:3001',
  },
}))

const TODO_ENDPOINT = 'http://localhost:3001/example-todo'

// ② MSW 핸들러 등록
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

// ③ 라이프사이클
beforeAll(() => server.listen()) // 테스트 시작 전 서버 기동
afterEach(() => server.resetHandlers()) // 매 테스트 후 핸들러 초기화
afterAll(() => server.close()) // 전체 종료
```

### 테스트 작성 패턴

```ts
// 기본 조회
it('할 일 목록을 가져옴', async () => {
  const { result } = renderHook(() => useExampleTodoContent(), {
    wrapper: createQueryWrapper(), // ← 격리된 QueryClient
  })

  await vi.waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })

  expect(result.current.todos).toHaveLength(2)
})

// Mutation 실행
it('handleCreate가 새 항목을 추가함', async () => {
  const { result } = renderHook(() => useExampleTodoContent(), {
    wrapper: createQueryWrapper(),
  })

  await vi.waitFor(() => expect(result.current.isLoading).toBe(false))

  act(() => {
    result.current.handleCreate({ title: '공부하기' })
  })

  await vi.waitFor(() => expect(result.current.isCreating).toBe(false))
})

// 에러 시나리오 — server.use()로 핸들러 오버라이드
it('API 에러 시 빈 목록을 유지함', async () => {
  server.use(
    http.get(TODO_ENDPOINT, () =>
      HttpResponse.json({ message: 'Server Error' }, { status: 500 })
    )
  )

  const { result } = renderHook(() => useExampleTodoContent(), {
    wrapper: createQueryWrapper(),
  })

  await vi.waitFor(() => expect(result.current.isLoading).toBe(false))
  expect(result.current.todos).toEqual([])
})
```

### 테스트 플로우 시각화

```
renderHook(useExampleTodoContent, { wrapper: createQueryWrapper() })
  │
  ├── useExampleTodoList() 호출
  │     → useQuery(exampleTodoQueries.all())
  │     → http.get('/example-todo')
  │     → MSW 인터셉트 → mockTodos 반환
  │
  ├── vi.waitFor(() => isLoading === false)
  │     → 캐시에 데이터 저장 완료
  │
  ├── act(() => handleCreate({ title: '공부하기' }))
  │     → useMutation → http.post
  │     → MSW 인터셉트 → 성공 응답
  │     → onSuccess → invalidateQueries → 목록 재조회
  │
  └── 에러 테스트: server.use()로 500 오버라이드
        → retry: false이므로 즉시 실패
        → todos = [] (기본값 유지)
        → afterEach에서 resetHandlers() → 다음 테스트는 정상 핸들러 사용
```

---

## 새 도메인 추가 시 체크리스트

`product` 도메인을 추가한다면:

```
① entities/product/model/types.ts     ← Product 타입 정의
② entities/product/api/index.ts       ← productApi 객체
③ entities/product/api/queries.ts     ← productQueries + Query/Mutation 훅
④ 페이지에서 prefetch + HydrationBoundary 사용
```

```ts
// ① 타입
export interface Product {
  Info: { id: string; name: string; price: number }
}

// ② API 객체
export const productApi = {
  getList: () => http.get<Product['Info'][]>('/products').then(res => res.data),
}

// ③ queryOptions + 훅
export const productQueries = {
  rootKey: ['products'] as const,
  all: () => queryOptions({ queryKey: [...productQueries.rootKey], queryFn: productApi.getList }),
}
export function useProductList() { return useQuery(productQueries.all()) }

// ④ 페이지
export default async function ProductsPage() {
  const qc = getQueryClient()
  await qc.prefetchQuery(productQueries.all())
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductListContent />
    </HydrationBoundary>
  )
}
```

**shared/api는 건드릴 필요 없음** — http, QueryClient, ApiError는 이미 세팅 완료.

테스트도 같은 패턴:

```ts
// ⑤ 훅 테스트
const server = setupServer(
  http.get('http://localhost:3001/products', () =>
    HttpResponse.json(mockProducts)
  )
)

it('상품 목록을 가져옴', async () => {
  const { result } = renderHook(() => useProductContent(), {
    wrapper: createQueryWrapper(),
  })
  await vi.waitFor(() => expect(result.current.isLoading).toBe(false))
  expect(result.current.products).toHaveLength(3)
})
```

---

## 부록: 파일 맵

```
shared/api/
  ├── http.ts            ← Axios 인스턴스 + 인터셉터
  ├── error.ts           ← ApiError 클래스 + isApiError()
  ├── query-client.ts    ← getQueryClient() + 글로벌 설정
  └── index.ts           ← re-export

shared/config/
  ├── env.ts             ← t3-oss 환경변수 검증
  └── messages.ts        ← ERROR_MESSAGES 상수

entities/{domain}/api/
  ├── index.ts           ← API 객체 (domainApi)
  └── queries.ts         ← queryOptions 팩토리 + Query/Mutation 훅

mocks/
  └── create-query-wrapper.ts  ← 테스트용 격리 QueryClient

shared/providers/
  └── index.tsx          ← AppProviders (QueryClientProvider 래핑)

app/
  └── {route}/page.tsx   ← prefetchQuery + HydrationBoundary

widgets/{domain}/
  └── *.test.ts          ← renderHook + MSW + createQueryWrapper
```

---

## 공식 문서 레퍼런스

이 문서에서 참조한 공식 문서 및 베스트 프랙티스 출처:

| 주제                        | 공식 문서                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| TanStack Query 개요         | [TanStack Query v5](https://tanstack.com/query/v5/docs/framework/react/overview)                                       |
| SSR (HydrationBoundary)     | [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr)                    |
| queryOptions 팩토리         | [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options)                               |
| Mutations                   | [Mutations Guide](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)                                 |
| Invalidation from Mutations | [Invalidations from Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations) |
| Important Defaults          | [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults)                     |
| Testing                     | [Testing Guide](https://tanstack.com/query/v5/docs/framework/react/guides/testing)                                     |
| MutationCache               | [MutationCache Reference](https://tanstack.com/query/v5/docs/reference/MutationCache)                                  |
| Axios HTTP 클라이언트       | [Axios](https://axios-http.com)                                                                                        |
| MSW 테스트 연동             | [MSW](https://mswjs.io/docs)                                                                                           |
| Vitest 테스트 프레임워크    | [Vitest](https://vitest.dev)                                                                                           |

---

[← 이전: 텍스트 스타일](./text-component.md) | [다음: 다이얼로그/모달 →](./dialog-modal.md)
