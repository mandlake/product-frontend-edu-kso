# Dialog & Modal 가이드

> Imperative Dialog vs Route Modal 선택 기준

[← 이전: 데이터 흐름](./tanstack-query-flow.md) | [다음: API 모킹 →](./msw.md)

## 선택 기준

```
URL 공유/북마크가 필요한가?
├── YES → Route Modal
└── NO → Imperative Dialog
```

## 비교표

| 용도                               | 권장 방식         | 이유                                      |
| ---------------------------------- | ----------------- | ----------------------------------------- |
| URL 공유 필요 (상품 상세, 사진 등) | Route Modal       | URL로 공유/북마크 가능, 새로고침해도 유지 |
| SEO 필요                           | Route Modal       | 검색엔진이 크롤링 가능                    |
| 단순 확인/알림                     | Imperative Dialog | URL 불필요, 빠른 피드백                   |
| 임시 UI (삭제 확인 등)             | Imperative Dialog | 히스토리에 남을 필요 없음                 |

## 용도별 선택

| 용도                 | 방식              | 사용할 것                                         |
| -------------------- | ----------------- | ------------------------------------------------- |
| 상품 상세, 사진 뷰어 | Route Modal       | `@modal/(.)slug` + `<Link>` (라우트 그룹 내 배치) |
| 삭제 확인            | Imperative Dialog | `useDialog().confirm()`                           |
| 알림/안내            | Imperative Dialog | `useDialog().alert()`                             |
| 필터/옵션 선택       | Imperative Dialog | `useDialog().drawer()`                            |
| 약관 전문 보기       | Imperative Dialog | `useDialog().fullScreen()`                        |

---

## 1. Route Modal

URL이 변경되는 모달. Next.js Intercepting Routes 사용.

### 특징

- URL 공유/북마크 가능
- 새로고침해도 상태 유지
- 검색엔진 크롤링 가능 (SEO)
- 브라우저 히스토리에 기록

### 폴더 구조

> `@modal`은 루트가 아닌 해당 라우트 그룹 내에 배치합니다.

```
src/app/example/
├── @modal/                    # Parallel Route (모달 슬롯)
│   ├── default.tsx            # 매칭 없을 때 null 반환
│   └── (.)modal/[id]/         # Intercepting Route
│       └── page.tsx           # Link 클릭 시 Drawer로 렌더링
├── layout.tsx                 # modal 슬롯을 렌더링하는 레이아웃
└── page.tsx
```

### 사용법

```tsx
// 링크로 열기 (같은 라우트 그룹 내 경로)
import Link from 'next/link'
;<Link href="/example/modal/product-123">상품 보기</Link>
```

### 동작 흐름

| 접근 방식     | 렌더링                                   |
| ------------- | ---------------------------------------- |
| `<Link>` 클릭 | `@modal/(.)modal/[id]/page.tsx` → Drawer |

---

## 2. Imperative Dialog

`useDialog()` 훅으로 프로그래매틱하게 열기. URL 변경 없음.

### 특징

- 즉각적인 피드백
- URL 변경 없음
- 히스토리에 남지 않음
- Promise 기반 결과 반환

### 타입

| 타입         | 용도      | 반환값      |
| ------------ | --------- | ----------- |
| `alert`      | 단순 알림 | `void`      |
| `confirm`    | 확인/취소 | `boolean`   |
| `drawer`     | 바텀시트  | `T \| null` |
| `fullScreen` | 전체화면  | `void`      |

### 사용법

```tsx
import { useDialog } from '@/shared/lib/dialog'

function MyComponent() {
  const { alert, confirm, drawer, fullScreen } = useDialog()

  // Alert - 단순 알림
  const handleAlert = async () => {
    await alert({
      title: '알림',
      description: '저장되었습니다.',
    })
  }

  // Confirm - 확인/취소
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: '삭제하시겠습니까?',
      description: '이 작업은 되돌릴 수 없습니다.',
    })

    if (confirmed) {
      await deleteItem()
    }
  }

  // Drawer - 바텀시트
  const handleFilter = async () => {
    const result = await drawer({
      title: '필터',
      content: <FilterSheet />,
    })

    if (result) {
      applyFilter(result)
    }
  }

  // FullScreen - 전체화면
  const handleTerms = async () => {
    await fullScreen({
      title: '이용약관',
      content: <TermsContent />,
    })
  }
}
```

---

## 3. 닫기 동작

타입별로 닫기 동작이 다릅니다:

| 동작              | alert / confirm | drawer    | fullScreen |
| ----------------- | --------------- | --------- | ---------- |
| ESC 키            | 모달 닫기       | 모달 닫기 | 모달 닫기  |
| Overlay 클릭      | 모달 닫기       | 모달 닫기 | 모달 닫기  |
| 브라우저 뒤로가기 | 모달 닫기       | 모달 닫기 | 모달 닫기  |
| 스와이프          | -               | 모달 닫기 | -          |

> 사용자 응답이 반드시 필요한 경우 `closeOnOverlayClick: false` 옵션을 사용하세요.

---

## 4. 언제 무엇을 쓸까?

### Route Modal을 써야 할 때

- 상품 상세 페이지
- 사진/이미지 뷰어
- 게시글 상세
- 공유 가능해야 하는 콘텐츠

### Imperative Dialog를 써야 할 때

- 삭제 확인
- 로그아웃 확인
- 성공/실패 알림
- 필터 선택
- 옵션 선택 (배송지, 쿠폰 등)
- 약관 보기

---

[← 이전: 데이터 흐름](./tanstack-query-flow.md) | [다음: API 모킹 →](./msw.md)
