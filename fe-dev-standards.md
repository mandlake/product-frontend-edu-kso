# Frontend 개발 표준 문서

> 본 문서는 팀 내 Frontend 개발의 일관성, 품질, 유지보수성을 확보하기 위한 공통 기준을 정의한다.

## 1. 목적 (Purpose)

- 코드 품질의 일관성 유지
- 협업 시 커뮤니케이션 비용 감소
- 신규 인원 온보딩 시간 단축
- 유지보수 및 확장성 향상

## 2. 적용 범위 (Scope)

- 본 표준은 모든 Frontend 프로젝트에 적용한다.
- 예외가 필요한 경우 사전에 팀 합의를 거친다.

## 3. 기술 스택 표준

### 3.1 필수 기술 스택

### React

| **구분**             | 스택                                              |
| -------------------- | ------------------------------------------------- |
| Framework            | React + TypeScript                                |
| Build Tool           | Vite                                              |
| Styling              | Tailwind CSS, shadcn, mui, headless ui, chakra ui |
| 서버 상태 관리       | TanStack Query ,React Query                       |
| 클라이언트 상태 관리 | Zustand                                           |
| router               | react router                                      |

### Next

| **구분**             | 스택                                   |
| -------------------- | -------------------------------------- |
| Framework            | React + Next + TypeScript              |
| Build Tool           | Next                                   |
| Styling              | Tailwind CSS, shadcn, mui, headless ui |
| 서버 상태 관리       | TanStack Query, React Query            |
| 클라이언트 상태 관리 | Zustand                                |
| router               | Next                                   |

이미지 최적화 : next/image 사용하거나 이미지 포맷 WebP 권장
라이브러리 도입 주의 : 번들 사이즈에 민감한 라이브러리 우선 고려 (예: Moment.js 대신 Day.js)

### vue2

: 공식 지원 종료로 신규 프로젝트에서는 지양 유지보수 프로젝트에만 적용

| **구분**             | 스택                                        |
| -------------------- | ------------------------------------------- |
| Framework            | vue2 + Nuxt2                                |
| Build Tool           | Webpack                                     |
| Styling              | Tailwind CSS, vuetify, Quasar, BootstrapVue |
| 서버 상태 관리       | vue-query                                   |
| 클라이언트 상태 관리 | Vuex                                        |
| router               | vue router v3 (nuxt는 x)                    |

### vue3

| **구분**             | 스택                                                  |
| -------------------- | ----------------------------------------------------- |
| Framework            | vue3 + Nuxt3 + TypeScript                             |
| Build Tool           | vite                                                  |
| Styling              | Tailwind CSS, vuetify, headless ui, naive ui , Quasar |
| 서버 상태 관리       | @tanstack/vue-query                                   |
| 클라이언트 상태 관리 | Pinia                                                 |
| router               | vue router v4 (nuxt는 x)                              |

### 3.2 공통 개발 도구

- ESLint / Prettier
- Git + GitHub
- Husky + lint-staged
- **코드 품질 도구**
  ### ✔ 정적 분석(문법/코드 스타일)
  - **ESLint** → 자바스크립트/리액트 표준 린터
  - **TypeScript** → 타입 안정성 (정적 타입체크)
  ***
  ### ✔ 코드 포맷터(자동 정렬)
  - **Prettier**
    👉 코드를 자동으로 예쁘게 정리 (규칙 강제)
  - ⭐ 실무 기본 조합
  ```
  ESLint + Prettier
  ```
  ***
  ### ✔ 커밋/규칙 강제(협업 품질)
  - **Husky** → git hook 관리
  - **lint-staged** → 변경 파일만 린트 실행
  - **Commitlint** → 커밋 메시지 규칙 검사 (Conventional Commit)
  ***
  ### ✔ 테스트(동작 품질)
  - **Jest** → 단위 테스트 표준
  - **React Testing Library** → 리액트 UI 테스트
  - **Vitest** → Vite 프로젝트용 빠른 테스트 러너
  - **Cypress** → E2E 테스트(브라우저 자동화)
  ***
  ### ✔ 번들 분석 / 성능 품질
  - **Webpack Bundle Analyzer**
  - **Vite Bundle Visualizer**
  - **Source Map Explorer**
    👉 “번들 크기 터진 거” 잡을 때 필수
  ***
  ### ✔ 코드 스멜/복잡도 확인
  - **ESLint rules**
  - **SonarQube**
  - **CodeClimate**
  ***
  ### ✔ 보안 품질
  - **npm audit**
  - **Snyk**
  - **Dependabot**
  - **GitHub security alerts**
    👉 의존성 취약점 자동 탐지
  ***
  ### ✔ 스타일/디자인 시스템 일관성
  - **Storybook**
    → UI 컴포넌트 카탈로그 + 시각 테스트

### 3.3 Typescript 작성 원칙

- any 사용 지양 : 불가피한 경우를 제외하고 any 사용을 금하며, unknown 활용
- eunm 대신 as const 또는 Union Type 사용 : tree-shaking 이점을 위해 권장
- 외부 API 타입 정의 : 서버 응답값에 대한 Interface/Type 정의를 필수하여 data.xxx 접근 시 자동 완성을 보장

##### tree-shaking : 사용하지 않는 코드를 빌드할때 자동으로 제거해서 번들 크기를 줄이는 최적화

## 4. 프로젝트 구조 규칙

### 4.1 폴더 구조

#### 4.1.1 기본 구조

```
src/
 ├ app/                    # 애플리케이션 진입점, 전역 설정 (라우터, 스토어, 프로바이더)
 ├ pages/                  # 라우팅 단위 페이지 컴포넌트
 ├ components/             # 재사용 가능한 UI 컴포넌트 (버튼, 모달 등)
 ├ features/               # 비즈니스 기능 단위 로직
 ├ hooks/                  # 공통 Custom Hook (React)
 ├ services/               # 공통 Composable (Vue)
 ├ stores/                 # 전역 상태 관리
 ├ utils/                  # 공통 유틸 함수
 ├ constants/              # 상수 정의 (enum, 고정값)
 ├ styles/                 # 전역 스타일, 공통 SCSS, Tailwind 설정 등
 ├ assets/                 # 이미지, 아이콘, 폰트 등 정적 리소스
 ├ types/                  # TypeScript 타입 정의
 └ tests/                  # 테스트 코드
```

#### 4.1.2 FSD 아키텍처(Feature-Sliced Design)

```
src/
 ├ app/                    # 앱 초기화, 전역 설정, 라우팅, 레이아웃
 ├ pages/                  # 라우팅과 직접 연결되는 페이지
 ├ widgets/                # 페이지 구성 블록
 ├ features/               # 기능 단위 (로그인, 검색 등)
 ├ entities/               # 도메인 모델 (User, Order 등)
 └ shared/                 # 공통 리소스
     ├ ui/                 # 공통 UI 컴포넌트
     ├ api/                # 공통 API 모듈
     ├ lib/                # 공통 로직, 헬퍼
     ├ config/             # 환경/설정
     └ types/              # 공통 타입
```

#### 4.1.3 FSD 아키텍처 + Next.js

```
src/
 ├ app/                    # Next.js App Router (라우팅, 레이아웃)
 │   └ (routes)/           # 페이지 그룹 (선택)
 │       └ users/
 │           └ page.tsx    # 페이지 엔트리
 │   ├ layout.tsx          # 전역 레이아웃
 │   ├ page.tsx            # 메인 페이지
 │   ├ loading.tsx         # 로딩 UI
 │   ├ error.tsx           # 에러 처리 UI
 │   ├ not-found.tsx       # 404 페이지
 │   ├ globals.css         # 전역 스타일
 │   └ api/                # API Routes (BFF 역할)
 │
 ├ widgets/                # 페이지 구성 블록
 ├ features/               # 기능 단위
 ├ entities/               # 도메인 모델
 └ shared/                 # 공통 리소스
```

- app : provider, 전역 스타일, 전역 컨텍스트 등 어플리케이션의 최상단에서 사용되는 것
- page : 서비스 페이지 컴포넌트
- widgets : 여러개의 독립적인 UI를 합쳐서 하나의 컴포넌트로 만드는 것
- features: 사용자 이벤트를 다루는곳 (비즈니스 로직) (ex: 게시물 북마크, 메세지 전송)
- entities: 데이터의 모델 (ex: 프로필 데이터 모델, 게시판 데이터 모델 등)
- shared: 재사용이 필요하거나 유틸리티로 쓰이는 함수들 같이 공유가 필요한 것들이 포함

✔ import하여 사용 가능한 범위 존재

| layer    | 사용할 수 있는 계층                |
| -------- | ---------------------------------- |
| app      | 모두 사용 가능                     |
| page     | widgets, features, entites, shared |
| widgets  | features, entites, shared          |
| features | entites, shared                    |
| entites  | shared                             |
| shared   | X                                  |

### 4.2 Slice

- layer의 각 계층
- 폴더일 뿐 import해서 사용하는 것이 아님

### 4.3 Segment

- ui : 슬라이스 ui 컴포넌트
- model : 비즈니스 로직이 들어가는 곳, 데이터 모델 또는 actions이 들어감
- constants : 상수로써 쓰이는 값들
- hooks : 커스텀 훅
- api : 서버 요청에 쓰이는 것들(api, useQuery 등)
- utils : 각종 유틸 함수
- Segment는 slice 내에 존재
- shared는 바로 아래 Segment 존재

#### public API 규칙 : Slice나 Segment는 index.ts를 통해서만 외부로 노출

## 5. 코드 컨벤션

### 5.1 네이밍 규칙

|                                       | 네이밍 규칙       | 설명                                                           | 예시                 |
| ------------------------------------- | ----------------- | -------------------------------------------------------------- | -------------------- |
| directory                             | kebab-case        | 소문자 사용, 띄어쓰기를 - 로 구분                              | hello-world          |
| ts, js, 변수, 함수                    | camelCase         | 소문자 사용, 띄어쓰기를 대문자로 구분                          | helloWorld           |
| class, type, interface, tsx, 컴포넌트 | PascalCase        | 소문자 사용, 첫글자와 띄어쓰기를 대문자로 구분                 | HelloWorld           |
| 상수                                  | UPPER_CASE        | 대문자만 사용, 띄어쓰기를 \_ 로 구분                           | HELLO_WORLD          |
| hooks                                 | useXxx            | use로 시작, 첫글자와 띄어쓰기를 대문자로 구분                  | useHelloWord         |
| boolean                               | is/has/can prefix | 앞글자를 상황에 맞게 추가 후 첫글자와 띄어쓰기를 대문자로 구분 | isFocused, hasCoupon |

## 6. 컴포넌트 설계 원칙

- Presentational(UI) / Container(로직) 분리 권장
- Props는 명확한 타입 정의 필수
- props는 데이터 → 이벤트 순서로 정의
- Side Effect는 hook으로 분리
- 200줄 이하 권장 그 이상은 분리 필요

## 7. 상태 관리 규칙

### 7.1 상태 분류

| 구분                 | 예시                    | 도구                   |
| -------------------- | ----------------------- | ---------------------- |
| 서버 상태            | API 응답, 목록, 상세    | react query /vue-qeury |
| 클라이언트 전역 상태 | 모달, 테마, 로그인 여부 | zustand/pinia          |
| 로컬 UI 상태         | input, toggle…          | useState               |
| 파생 상태            | 계산값                  | 변수/selector          |

### 7.2 상태 관리 및 데이터 호출 원칙

#### 1. 전역 상태의 제한적 활용

전역 상태는 UI의 흐름이나 애플리케이션 전반에 영향을 주는 항목에 한하여 사용, 그 외의 비즈니스 로직이나 단순 데이터는 컴포넌트 단위의 지역 상태에서 관리

- 허용범위
  - UI 제어 : 모달, 드로어
  - 사용자 환경 설정 : 테마(다크/라이트), 언어 설정
  - 공통 필터 : 여러 화면에서 공유되는 검색 조건 및 필터 값

#### 2. API 호출 로직의 분리(관심사 분리)

컴포넌트의 가독성과 재사용성을 위해 데이터 통신 로직은 외부로 분리하여 관리

- 권장사항
  - API 호출은 별도 Service 레이어나 Custom Hook에서 수행
  - 컴포넌트는 전달받은 데이터의 렌더링에만 집중하도록 설계

## 8. API 연동 규칙

- API 공통 로직은 shared/api 폴더에 작성
- 공통 에러 처리 규칙 사용
- 응답 타입 명시 필수
- 컴포넌트에서 fetch/axios 직접 호출 금지

## 9. 테스트 가이드

### 9.1 테스트 대상

- 핵심 비즈니스 로직
- 공용 컴포넌트
- 유틸 함수

### 9.2 테스트 원칙

- 사용자 관점 테스트 우선
- 구현 세부사항 테스트 지양

## 10. Git & 협업 규칙

### 10.1 브랜치 전략

- main / develop / feature/\*

### 10.2 커밋 메시지 규칙

- Conventional Commits 사용

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경(코드 변경 없음)
style: 코드 포맷팅(예: 세미콜론 추가, 들여쓰기 변경)
refactor: 리팩토링(기능 변경 없음)
test: 테스트 추가/수정
chore: 기타 변경(예: 린트 설정, 패키지 매니저 변경)
revert: 이전 커밋 되돌리기
```

예시:

- feat: 로그인 기능 추가
- fix: 토큰 갱신 오류 수정

---

## 11. 코드 리뷰 프로세스

- PR 단위는 하나의 기능 기준
- 최소 1명 이상 리뷰 필수
- 리뷰 체크 항목:
  - 가독성
  - 네이밍
  - 사이드 이펙트
  - 테스트 포함 여부

## 12. 문서화 규칙

- README 필수 작성
- 공용 컴포넌트 사용법 문서화
- 변경 사항은 문서에 반영
