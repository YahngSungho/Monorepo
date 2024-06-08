# LiteLLM

- [LiteLLM](#litellm)
  - [Initialization](#initialization)
    - [proxy server 사용하기](#proxy-server-사용하기)
      - [bash에서 server 실행](#bash에서-server-실행)
        - [주의사항](#주의사항)
      - [proxy 서버 코드에서 사용하기](#proxy-서버-코드에서-사용하기)
  - [commands](#commands)
    - [health check](#health-check)
  - [reponse 형식](#reponse-형식)
    - [completion](#completion)
      - [타입](#타입)
      - [completion 예시](#completion-예시)
    - [embedding](#embedding)
  - [snippets](#snippets)
    - [사용할 수 있는 옵션 체크](#사용할-수-있는-옵션-체크)
    - [streaming](#streaming)
    - [전체 streaming 응답을 다시 빌드](#전체-streaming-응답을-다시-빌드)
    - [track\_cost\_callback](#track_cost_callback)
  - [Links](#links)
    - [이런 기능 필요할 때 즉석에서 참고해 쓰기](#이런-기능-필요할-때-즉석에서-참고해-쓰기)
    - [이런 기능들이 있다](#이런-기능들이-있다)
    - [Production 전에 세팅해놔야 할 것들](#production-전에-세팅해놔야-할-것들)
    - [Proxy server 관련](#proxy-server-관련)

## Initialization

### proxy server 사용하기

#### bash에서 server 실행

plain

```bash
litellm --config ./Litellm_config.yaml
```

.env와 연결

```bash
dotenv -e .env -- litellm --config ./Litellm_config.yaml
```

##### 주의사항

- config.yaml에 한글 들어가면 parsing 안됨

#### proxy 서버 코드에서 사용하기

1. `openai.OpenAI` api를 통해 사용 - 이게 권장되는 방법
2. 그냥 `litellm.completion` 사용하면 proxy server 사용 안하고 하는 거임
3. `litellm.completion` 으로 프록시 사용하려면 `api_base`, `api_key` 설정하고 model 이름을 `{provider}/{model}` 형식으로 설정해야함
   - This is not recommended. There is duplicate logic as the proxy also uses the sdk, which might lead to unexpected errors. (<https://docs.litellm.ai/docs/proxy/quick_start#using-litellm-proxy---curl-request-openai-package-langchain>)

## commands

### health check

```bash
curl --location 'http://localhost:4000/health' -H "Authorization: Bearer sk-5798"
```

## reponse 형식

### completion

#### 타입

```json
{
  "choices": [
    {
      "finish_reason": str,     # String: "stop"
      "index": int,             # Integer: 0
      "message": {              # Dictionary [str, str]
        "role": str,            # String: "assistant"
        "content": str          # String: "default message"
      }
    }
  ],
  "created": str,               # String: None
  "model": str,                 # String: None
  "usage": {                    # Dictionary [str, int]
    "prompt_tokens": int,       # Integer
    "completion_tokens": int,   # Integer
    "total_tokens": int         # Integer
  }
}
```

#### completion 예시

```json
{
  "id": "chatcmpl-8c5qbGTILZa1S4CK3b31yj5N40hFN",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "As an AI language model, I do not have a physical form or personal preferences. However, I am programmed to assist with various topics and provide information on a wide range of subjects. Is there something specific you would like assistance with?"
      }
    }
  ],
  "created": 1704089632,
  "model": "gpt-35-turbo",
  "object": "chat.completion",
  "system_fingerprint": null,
  "usage": {
    "completion_tokens": 47,
    "prompt_tokens": 12,
    "total_tokens": 59
  },
  "_response_ms": 1753.426
}
```

### embedding

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255,
        -0.009327292,
        ....
        -0.0028842222,
      ],
      "index": 0
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

## snippets

### 사용할 수 있는 옵션 체크

```py
from litellm import get_supported_openai_params

response = get_supported_openai_params(model="anthropic.claude-3", custom_llm_provider="bedrock")

print(response) # ["max_tokens", "tools", "tool_choice", "stream"]
```

### streaming

```py
from litellm import completion
messages = [{"role": "user", "content": "Hey, how's it going?"}]
response = completion(model="gpt-3.5-turbo", messages=messages, stream=True)
for part in response:
    print(part.choices[0].delta.get('content', ""))
```

### 전체 streaming 응답을 다시 빌드

```py
messages = [{"role": "user", "content": "Hey, how's it going?"}]
response = completion(model="gpt-3.5-turbo", messages=messages, stream=True)

chunks = []
for chunk in response:
    chunks.append(chunk)

newResponse = litellm.stream_chunk_builder(chunks, messages=messages)
print(newResponse)

print(newResponse.choices[0].message.content)

```

### track_cost_callback

```py
# track_cost_callback
def track_cost_callback(
    kwargs,                 # kwargs to completion
    completion_response,    # response from completion
    start_time, end_time    # start/end time
):
    try:
      response_cost = kwargs.get("response_cost", 0)
      print("\n")
      print("streaming start_time", start_time)
      print("streaming end_time", end_time)
      print("streaming response_cost", response_cost)
      print("\n")
    except OpenAIError as e:
      print("Error", e)
# set callback
litellm.success_callback = [track_cost_callback] # set custom callback function
```

## Links

### 이런 기능 필요할 때 즉석에서 참고해 쓰기

1. [Function Call](https://docs.litellm.ai/docs/completion/function_call) - OpenAI가 아닌 경우 Add to prompt for non-openai models, set: litellm.add_function_to_prompt = True
  -> 이거 `assert`랑 같이 감싸서 아예 함수 호출 래퍼 만들자
2. [예산 설정](https://docs.litellm.ai/docs/budget_manager) - **이거 1회성 설정은 개발 중에도 사용하기!!**
3. [Mock Response](https://docs.litellm.ai/docs/completion/mock_requests)
4. [Batching Completion](https://docs.litellm.ai/docs/completion/batching)
5. [Relability](https://docs.litellm.ai/docs/completion/reliable_completions)

### 이런 기능들이 있다

1. [LLM에 Image Input](https://docs.litellm.ai/docs/completion/vision)
2. [입력 메시지 트리밍](https://docs.litellm.ai/docs/completion/message_trimming)
3. [입력이나 출력의 내용으로 조건부 실패하기](https://docs.litellm.ai/docs/rules)
4. [임베딩](https://docs.litellm.ai/docs/embedding/supported_embedding)
5. [캐싱](https://docs.litellm.ai/docs/caching/all_caches)
6. [Logger Function](https://docs.litellm.ai/docs/debugging/local_debugging)
7. 비용 추적
   1. <https://docs.litellm.ai/docs/observability/supabase_integration>
   2. <https://docs.litellm.ai/docs/completion/token_usage>

### Production 전에 세팅해놔야 할 것들

1. [Secret Manager](https://docs.litellm.ai/docs/secret)
2. [Louter](https://docs.litellm.ai/docs/routing)
3. [토큰 사용 및 비용](https://docs.litellm.ai/docs/completion/token_usage)

### Proxy server 관련

1. <https://docs.litellm.ai/docs/proxy/deploy>
2. <https://docs.litellm.ai/docs/proxy/prod>
3. <https://docs.litellm.ai/docs/proxy/virtual_keys> - 지출 추적
4. <https://docs.litellm.ai/docs/proxy/reliability>
5. <https://docs.litellm.ai/docs/proxy/users>
6. <https://docs.litellm.ai/docs/proxy/billing> - 만약 사용량 기반으로 billing 할 거라면
7. <https://docs.litellm.ai/docs/proxy/user_keys> - 유저가 자기 api 키 넣어서 사용할 수 있게 하기
8. <https://docs.litellm.ai/docs/proxy/enterprise>
9. <https://docs.litellm.ai/docs/proxy/alerting>
10. <https://docs.litellm.ai/docs/proxy/logging>
11. <https://docs.litellm.ai/docs/proxy/streaming_logging>
12. <https://docs.litellm.ai/docs/proxy/team_based_routing> - 팀을 위한 플랜 만든다면
13. <https://docs.litellm.ai/docs/proxy/customer_routing> - locale 문제
14. <https://docs.litellm.ai/docs/proxy/pii_masking> - 개인정보 보호
15. <https://docs.litellm.ai/docs/proxy/prompt_injection>
16. <https://docs.litellm.ai/docs/proxy/caching>
17. <https://docs.litellm.ai/docs/proxy/call_hooks>
18. <https://docs.litellm.ai/docs/proxy/rules>
19. <https://docs.litellm.ai/docs/proxy/ui> - DB와 연결 후 프록시 서버 대시보드 사용 가능
