# 마크다운 테스트 문서

## 1. 제목 스타일

### 이것은 H3 제목입니다

#### 이것은 H4 제목입니다

##### 이것은 H5 제목입니다

###### 이것은 H6 제목입니다

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## 2. 텍스트 서식

일반 텍스트와 **굵은 텍스트**, _기울임 텍스트_, **_굵은 기울임 텍스트_**를 혼합할 수 있습니다.
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
[내부 링크](#1-제목-스타일)를 사용하여 문서 내에서 이동할 수 있습니다.

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

여기에 각주[^1]가 있습니다.

[^1]: 이것은 각주의 내용입니다.

## 13. 정의 목록

마크다운
: 텍스트를 HTML로 변환하는 가벼운 마크업 언어

HTML
: 웹 페이지를 만들기 위한 표준 마크업 언어

---

이 문서는 마크다운의 다양한 기능을 테스트하기 위한 샘플입니다.
