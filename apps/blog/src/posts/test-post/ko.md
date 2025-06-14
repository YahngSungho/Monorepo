# 마크다운 테스트 문서

[다른 포스트](/posts/second-post)로 이동하는 링크를 만들 수 있습니다.

여기에 각주[^1]가 있습니다.

[^1]: 이것은 각주의 내용입니다.

## title

### 이것은 H3 제목입니다

#### 이것은 H4 제목입니다

##### 이것은 H5 제목입니다

###### 이것은 H6 제목입니다

<Mermaid>
flowchart TD
    A[Start] -- "라벨" --> B{Middle}
    B --> C[End]
</Mermaid>

<Mermaid>
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
</Mermaid>

<Mermaid>
graph TD
    A["testUIComponent 시작"] --> B{"테스트 반복 (iterationCount 만큼)"};
    B -- "반복" --> C["runSingleIteration 실행"];
    C --> D("컴포넌트 상태 초기화 - resetComponentState");
    D --> E("상호작용 요소 탐색 - discoverInteractions");
    E --> F{"인터랙션 존재?"};
    F -- "Yes" --> G("인터랙션 시퀀스 Arbitrary 생성 - createInteractionSequenceArbitrary");
    F -- "No" --> H("기본 렌더링 상태 확인 - verifyComponentState");
    H --> I["반복 종료"];
    G --> J("fast-check 실행 - fc.check");
    J -- "asyncProperty" --> K{"인터랙션 시퀀스 생성"};
    K -- "각 인터랙션" --> L("인터랙션 실행 - executeInteraction");
    L -- "성공" --> M{"모든 인터랙션 성공?"};
    M -- "Yes" --> N("최종 상태 검증 - verifyComponentState");
    N --> O{"Property 만족?"};
    O -- "Yes" --> P("테스트 성공");
    P --> K;
    M -- "No" --> Q("실패: 인터랙션 오류");
    L -- "실패" --> Q;
    O -- "No" --> R("실패: 최종 상태 검증 실패");
    Q --> S{"Shrinking 시도"};
    R --> S;
    S -- "축소된 반례 발견" --> T("디버깅 실행 - debugWithShrunkExample");
    T --> U("실패 정보 기록");
    U --> I;
    J -- "fast-check 종료" --> V{"테스트 실패?"};
    V -- "Yes" --> W("디버그 정보 저장 - saveDebugInfo");
    W --> I;
    V -- "No" --> I;
    B -- "모든 반복 완료" --> X("최종 결과 반환 및 Playwright 단언");
    X --> Y["testUIComponent 종료"];

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style Y fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style J fill:#ccf,stroke:#333,stroke-width:2px
    style L fill:#ccf,stroke:#333,stroke-width:2px
    style T fill:#ccf,stroke:#333,stroke-width:2px
    style W fill:#fcc,stroke:#333,stroke-width:1px

</Mermaid>

## 2. 텍스트 서식

일반 '텍스트'와 **굵은 텍스트**, _기울임 텍스트_, **_굵은 기울임 텍스트_**를 혼합할 수 있습니다.
또한 ~~취소선~~도 사용할 수 있습니다.

## 3. 목록

### 순서 없는 목록

- 항목 1
- 항목 2
  - 중첩 항목 2.1
  - 중첩 항목 2.2
- 항목 3

### 순서 있는 목록

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목
   1. 중첩된 항목 3.1
   2. 중첩된 항목 3.2

### 작업 목록

- [x] 완료된 작업

- [ ] 진행 중인 작업
- [ ] 아직 시작하지 않은 작업

## 4. 링크

[GitHub](https://github.com)에 방문하세요.
[내부 링크](#title)를 사용하여 문서 내에서 이동할 수 있습니다.

## 5. 이미지

## 6. 코드

인라인 `코드`를 사용할 수 있습니다.

```javascript
// 코드 블록
function hello() {
	console.log('안녕하세요, 마크다운!')
}
```

```python
# 파이썬 코드 예시
def greet(name):
    return f"안녕하세요, {name}님!"

print(greet("사용자"))
```

## 7. 인용문

> 이것은 인용문입니다.
>
> 여러 줄에 걸쳐 작성할 수 있습니다.
>
> > 중첩된 인용문도 가능합니다.

## 8. 수평선

---

## 9. 표

| 이름   | 나이 | 직업     |
| ------ | ---- | -------- |
| 홍길동 | 30   | 개발자   |
| 김철수 | 25   | 디자이너 |
| 이영희 | 28   | 마케터   |

정렬된 표:

| 왼쪽 정렬    | 가운데 정렬  |  오른쪽 정렬 |
| :----------- | :----------: | -----------: |
| 텍스트       |    텍스트    |       텍스트 |
| 더 긴 텍스트 | 더 긴 텍스트 | 더 긴 텍스트 |

## 10. 수식 (일부 마크다운 엔진에서 지원)

인라인 수식: $E = mc^2$

블록 수식:

$$
\frac{d}{dx}(e^x) = e^x
$$

## 11. HTML 요소 포함

<details>
<summary>클릭하여 더 보기</summary>
숨겨진 내용이 여기에 표시됩니다.
</details>

<div style="color: blue;">
이것은 파란색 텍스트입니다.
</div>

## 12. 각주

여기에 각주[^2]가 있습니다.

[^2]: 이것은 각주의 내용입니다.

## 13. 정의 목록

마크다운
: 텍스트를 HTML로 변환하는 가벼운 마크업 언어

HTML
: 웹 페이지를 만들기 위한 표준 마크업 언어

---

이 문서는 마크다운의 다양한 기능을 테스트하기 위한 샘플입니다.
