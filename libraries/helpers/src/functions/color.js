const toHex = (c) => ("0" + c.toString(16)).slice(-2);

export function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbStringToHex(rgbString) {
  // "rgb(248, 249, 250)"에서 숫자만 추출하여 배열로 만듭니다.
  const [r, g, b] = rgbString.match(/\d+/g).map(Number);

  return rgbToHex(r, g, b);
}