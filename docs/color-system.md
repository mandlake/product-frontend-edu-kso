# 컬러 시스템 가이드

> CSS Variables + Tailwind v4 기반 테마 컬러 설정

[← 이전: 프로젝트 구조](./architecture.md) | [다음: 텍스트 스타일 →](./text-component.md)

---

## 구조

```
src/app/globals.css     ← CSS 변수 정의 + Tailwind 매핑 (@theme inline)
```

Tailwind v4는 **CSS 파일 내 `@theme inline`**으로 토큰을 확장합니다.

---

## 1. 시맨틱 컬러 (shadcn 호환)

`globals.css`의 `:root`에 정의된 시맨틱 변수들입니다. 라이트/다크 모드별로 값이 다릅니다.

| 변수            | 용도             | Tailwind 사용                            |
| --------------- | ---------------- | ---------------------------------------- |
| `--background`  | 기본 배경        | `bg-background`                          |
| `--foreground`  | 기본 텍스트      | `text-foreground`                        |
| `--primary`     | 주요 액션 (버튼) | `bg-primary text-primary-foreground`     |
| `--secondary`   | 보조 액션        | `bg-secondary text-secondary-foreground` |
| `--muted`       | 비활성/보조      | `bg-muted text-muted-foreground`         |
| `--destructive` | 에러/삭제        | `text-destructive`                       |
| `--border`      | 테두리           | `border-border`                          |
| `--input`       | 입력 필드 테두리 | `border-input`                           |
| `--ring`        | 포커스 링        | `ring-ring`                              |

### 색상 변경 방법

`globals.css`에서 HSL 값을 변경하세요:

```css
:root {
  --primary: 229 66% 56%; /* ← 브랜드 컬러 */
  --primary-foreground: 0 0% 100%; /* ← 그 위의 텍스트 */
}

.dark {
  --primary: 229 66% 56%; /* 다크모드에서도 같거나 다른 값 */
  --primary-foreground: 0 0% 100%;
}
```

> HSL 형식: `색상(0-360) 채도(%) 밝기(%)` — `hsl()` 없이 숫자만 입력

---

## 2. 커스텀 컬러 추가

프로젝트 고유 컬러가 필요할 때 3단계로 추가합니다.

### Step 1. CSS 변수 정의 (`:root`)

```css
:root {
  /* TEMPLATE: 프로젝트 커스텀 컬러 추가 */
  --color-gray-50: 0 0% 96%;
  --color-gray-500: 0 0% 50%;
  --color-gray-900: 0 0% 10%;
  --color-primary-blue-500: 229 66% 56%;
  --color-system-red: 4 82% 56%;
}
```

### Step 2. Tailwind 매핑 (`@theme inline`)

```css
@theme inline {
  /* TEMPLATE: 커스텀 컬러 매핑 추가 */
  --color-gray-50: hsl(var(--color-gray-50));
  --color-gray-500: hsl(var(--color-gray-500));
  --color-gray-900: hsl(var(--color-gray-900));
  --color-primary-blue-500: hsl(var(--color-primary-blue-500));
  --color-system-red: hsl(var(--color-system-red));
}
```

### Step 3. 사용

```tsx
<div className="text-color-gray-500 bg-color-gray-50" />
<Text className="text-color-primary-blue-500">강조 텍스트</Text>
<Text className="text-color-system-red">에러 메시지</Text>
```

---

## 3. HEX → HSL 변환

| 입력                 | CSS 변수 값   |
| -------------------- | ------------- |
| `#7C3AED`            | `262 83% 58%` |
| `rgb(124, 58, 237)`  | `262 83% 58%` |
| `hsl(262, 83%, 58%)` | `262 83% 58%` |

> 변환 도구: [HSL Color Picker](https://hslpicker.com)

---

## 4. 레퍼런스 Gray Scale

```
gray-50:  0 0% 96%     gray-500: 0 0% 50%
gray-100: 0 0% 88%     gray-600: 0 0% 40%
gray-200: 0 0% 82%     gray-700: 0 0% 33%
gray-300: 0 0% 70%     gray-800: 0 0% 20%
gray-400: 0 0% 60%     gray-900: 0 0% 10%
```

---

## 5. 다크모드

### 활성화/비활성화

`src/shared/config/site.ts`에서 `enableDarkMode: false`로 변경하면 비활성화됩니다.

### 다크모드 색상 설정

`.dark` 블록에서 같은 변수를 다른 HSL 값으로 오버라이드합니다:

```css
.dark {
  --background: 0 0% 3.9%; /* 어두운 배경 */
  --foreground: 0 0% 98%; /* 밝은 텍스트 */
  --primary: 229 66% 56%; /* 브랜드 컬러 유지 또는 변경 */
}
```

---

## 빠른 참조

```tsx
// shadcn 시맨틱 (기본 제공)
'bg-background text-foreground' // 기본 레이아웃
'bg-primary text-primary-foreground' // 주요 버튼
'text-muted-foreground' // 보조 텍스트
'text-destructive' // 에러 메시지
'border-border' // 일반 테두리
'border-input' // 인풋 테두리

// 커스텀 컬러 (globals.css에 추가 후 사용)
'text-color-gray-900' // 기본 텍스트
'text-color-gray-500' // 보조 텍스트
'text-color-primary-blue-500' // 강조 텍스트
'bg-color-gray-50' // 연한 배경
```

---

[← 이전: 프로젝트 구조](./architecture.md) | [다음: 텍스트 스타일 →](./text-component.md)
