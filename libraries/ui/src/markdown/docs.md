# Custom Component

## 추가

<https://github.com/ssssota/svelte-exmarkdown/issues/36>

`plugins`에 `{ renderer: { customcomponent  } }` 식으로 추가

- `rehype-raw` 플러그인이 있어야 구동
- 플러그인에 대한 렌더러를 설정할 때 키는 모두 소문자여야 함
- 구성 요소 속성도 소문자로 작성해야 함
- <CustomButton/> 와 같은 자체 닫힘 구문을 사용할 수 없음

## 사용

작동 자체는 태그 이름을 소문자로 해도 되지만, custom component로 구별하기 위해서 camel case로 쓰도록 하기. `{ renderer: { customcomponent  } }` 이렇게 설정했어도 `<CustomComponent>` 이렇게.
