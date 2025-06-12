#!/bin/sh

# 명령어가 실패하면 즉시 스크립트를 중단합니다.
set -e

# 앱 이름이 인자로 제공되었는지 확인합니다.
if [ -z "$1" ]; then
  echo "오류: 앱 이름이 필요합니다."
  echo "사용법: pnpm run generate:app <appName>"
  exit 1
fi

APP_NAME=$1

echo ">>> 앱 생성 중: $APP_NAME"
turbo gen workspace --type app --copy @app/boiler_plates --name "@app/$APP_NAME" --destination "./apps/$APP_NAME"

echo ">>> Playwright 포트 번호 설정 중..."
node libraries/scripts/src/generate-app/setPortNumber.js "$APP_NAME"

echo ">>> 의존성 설치 중..."
pnpm install

echo "✅ 앱 '$APP_NAME' 생성 및 설정 완료!"