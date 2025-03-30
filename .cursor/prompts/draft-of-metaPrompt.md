- Meta Prompt Draft
  - 목표
    - 너에게 주어진 text(Original Prompt)를 받아서 그 text의 핵심과 의도를 LLM에게 가장 강력하게 전달할 수 있는 Prompt 형태로 새로운 text(Action Prompt)로 다시 작성하는 것
  - 용어 정리
    - Original Prompt
      - 개선의 대상이 되는 프롬프트
    - Meta Prompt
      - 현재 이 프롬프트
    - Action Prompt
      - Original Prompt를 Meta Prompt를 이용해 개선한 결과
    - Action Output
      - Action Prompt가 내놓은 결과물
    - 관계
      - Original Prompt를 Meta Prompt가 개선해서 Action Prompt를 내놓고, Action Prompt가 내놓은 결과물이 Action Output
  - Spec (Prompt를 마치 프로그래밍의 함수라고 생각했을 때의 Input과 Output)
    - Meta Prompt
      - Input
        1. 참고 자료들
        2. 개선의 대상이 되는 Original Prompt
      - Output
        - Action Prompt을 포함하는 3 부분으로 이뤄진 text
          1. Original Prompt 분석, 작업의 핵심과 의도 파악
          2. 그 외의 주어진 자료들의 내용 중 현재 하려는 개선 작업과 관련된 부분을 먼저 인용해서 나열하기
          3. Action Prompt의 작성 계획
             - Original Prompt가 하려는 작업의 특징을 고려해서, 그 작업을 최대한 잘 해내는 Action Prompt를 만들기 위해 어떤 Prompt Engeneering 기법을 사용할지
          4. Action Prompt 자체
             - XML로 작성
    - Action Prompt
      - Input
        - 참고 자료들
      - Output
        - Action Output
  - Format
    - Meta Prompt
      - Output
        - XML
          1. `<Original-Prompt-분석>`
          2. `<관련-자료>`
          3. `<Plan-for-Action-Prompt>`
          4. `<Action-Prompt>`
    - Action Prompt
      - File 형식
        - XML
      - Language
        - English (프롬프트의 효과를 위해 LLM에게 가장 익숙한 English 사용)
    - Action Output
      - Meta Prompt는 Original Prompt의 요구사항을 분석하여 Action Output의 최적의 format을 결정하고, 이를 Action Prompt 내에 명시한다
  - Action Prompt를 구성하기 위해 사용할 수 있는 Prompt Engeneering 기법 목록: Action Prompt의 각 작업, 서브 작업들의 특징에 따라 효과를 최대화 할 수 있도록 적절한 것을 선택해 사용할 것
    1. 예시 (n-shot prompt, in-context learning)
       - 주의사항
         - 예시들의 분포가 실제 상황에서의 분포와 거의 같아야 함. 출력 공간에서 균일하게 샘플링하는 대신, 출력의 실제 분포에 따라 샘플링해서 예시들을 제공하라. 예시들의 분포가 현실과 일치하는 것이 예시 자체가 올바르냐보다도 더 prompt의 효과에 영향을 크게 준다는 것이 알려져있다.
       - 들어가야 하는 예시들
         1. 까다로운 부분들에 대한 명확한 예시
         2. 하나의 예시에서, 올바른 답과 그리고 쉽게 혼동할 수 있는 잘못된 답 모두 포함
         3. LLM이 도구를 사용하게 하는 게 좋다면, '해당 도구의 사용' 자체에 대한 예시를 포함
         4. '추론 과정' 자체에 대한 예시를 포함
    2. Chain of Thoughts
       - pormpt 예시들
         - Let's first understand the problem and devise a plan to solve the problem. Then, let's carry out the plan and solve the problem step by step.
         - Let's first understand the problem, extract relevant variables and their corresponding numerals, and devise a plan. Then, let's carry out the plan, calculate intermediate results (pay attention to calculation and common sense), solve the problem step by step, and show the answer.
    3. Least-to-Most Prompting
    4. Rephrase and Respond (RaR)
    5. Tabular Chain-of-Thought (Tab-CoT)
    6. Analogical Prompting
    7. Logic-of-Thought (LoT)
    8. Code Prompting
    9. 내용이나 지시사항 강조
       - Use ALL CAPS
    10. 출력 스키마
        - 타입스크립트 문법으로 작성
        - 스키마를 TypeScript 타입으로 정의하면 유연하고 신뢰할 수 있으며 최소한의 토큰을 차지합니다. 출력 JSON 구조는 거의 항상 올바르지만, 모델이 스키마 밖의 값을 선택할 수 있는 문제가 발생할 수 있습니다. 이는 사후 검증으로 쉽게 해결할 수 있습니다
        - 포텐셜 필드와 실제 필드를 사용해서, LLM이 여러 옵션을 만들고 최적의 옵션을 선택하게 하기
  - 주의사항
    - Original Prompt에 적혀진 내용들 존중할 것
      - Original Prompt에 적힌 내용 중 소실되는 게 있어선 안된다
      - 주제넘게 Original Prompt에서 하려는 의도를 벗어난 작업을 하려고 하지 마라
    - Action Prompt에는 다음 내용이 포함돼야 한다
      1. 작업의 핵심과 의도를 파악하는 부분
      2. 주어진 자료들의 내용 중 현재 하려는 개선 작업과 관련된 부분을 먼저 인용해서 나열하는 부분
