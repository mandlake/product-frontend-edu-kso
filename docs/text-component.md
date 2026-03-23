# Text 컴포넌트 가이드

> CVA + Tailwind 기반 조합형 Typography 시스템

[← 이전: 컬러 시스템](./color-system.md) | [다음: 데이터 흐름 →](./tanstack-query-flow.md)

---

## 원칙

이 프로젝트에서는 `<span>`, `<p>` 대신 **항상 `<Text>` 컴포넌트**를 사용합니다.

```tsx
// ❌ 금지
;<span className="text-sm text-gray-500">보조 텍스트</span>

// ✅ 필수
import { Text } from '@/shared/ui/atoms/text'
;<Text color="muted">보조 텍스트</Text>
```

---

## 파일 위치

```
src/shared/ui/atoms/text/
├── Text.tsx            # Text 컴포넌트
├── Text.variants.ts    # CVA variant 정의 ← 여기를 수정
└── index.ts
```

---

## 조합형 API

`size`, `weight`, `color` 3개 props를 자유롭게 조합합니다.

### Props

| Prop     | 기본값      | 옵션                                         |
| -------- | ----------- | -------------------------------------------- |
| `size`   | `sm` (14px) | `xs`, `sm`, `base`, `lg`, `xl`, `2xl`        |
| `weight` | `normal`    | `normal`, `medium`, `semibold`, `bold`       |
| `color`  | `default`   | `default`, `muted`, `destructive`, `primary` |
| `as`     | `span`      | `span`, `p`, `label`, `h1`~`h6`              |

### 사용 예시

```tsx
// 기본 텍스트 (14px, normal, foreground)
<Text>기본 텍스트</Text>

// 제목 (18px, bold)
<Text as="h1" size="lg" weight="bold">섹션 제목</Text>

// 페이지 제목 (24px, semibold)
<Text as="h1" size="2xl" weight="semibold">페이지 제목</Text>

// 보조 설명 (14px, muted)
<Text color="muted">보조 텍스트</Text>

// 에러 메시지 (12px, medium, muted)
<Text size="xs" weight="medium" color="muted">에러 메시지</Text>

// 강조 텍스트
<Text weight="bold">강조 텍스트</Text>
<Text color="primary">링크 텍스트</Text>
```

---

## Variant 확장

### globals.css에 커스텀 사이즈/컬러 추가

`Text.variants.ts`의 주석에 안내된 대로 확장합니다:

```typescript
// Text.variants.ts
export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',

      // TEMPLATE: 커스텀 사이즈 추가
      // globals.css에 line-height 포함 정의 후 사용
      // '14': 'text-14',  // 14px / 20px
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      primary: 'text-primary',

      // TEMPLATE: 커스텀 컬러 추가
      // globals.css에 CSS 변수 정의 후 사용
      // 'gray-500': 'text-color-gray-500',
    },
  },
})
```

---

## `as` prop

`<Text>`는 기본적으로 `<span>`을 렌더링합니다. `as` prop으로 태그를 변경할 수 있습니다:

```tsx
<Text as="h1" size="lg" weight="bold">페이지 제목</Text>
<Text as="p" color="muted">단락 텍스트</Text>
<Text as="label">폼 라벨</Text>
```

---

## 커스텀 텍스트 사이즈

Tailwind 기본 사이즈(`text-xs`, `text-sm` 등) 외에 커스텀 사이즈가 필요하면 `globals.css`에 추가:

```css
@theme inline {
  /* TEMPLATE: 커스텀 텍스트 사이즈 추가 */
  --text-12: 0.75rem;
  --text-12--line-height: 1.125rem;
  --text-14: 0.875rem;
  --text-14--line-height: 1.25rem;
  --text-16: 1rem;
  --text-16--line-height: 1.375rem;
  --text-18: 1.125rem;
  --text-18--line-height: 1.625rem;
}
```

이후 `size` variant에 `'14': 'text-14'` 등으로 추가 가능합니다.

---

[← 이전: 컬러 시스템](./color-system.md) | [다음: 데이터 흐름 →](./tanstack-query-flow.md)
