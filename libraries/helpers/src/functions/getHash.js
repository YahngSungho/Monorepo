export const getSimpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.codePointAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // 32비트 정수로 변환
  }
  return hash;
};
