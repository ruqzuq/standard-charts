/**
 ASCII (C0 Controls and Basic Latin):
 32-126
 */

/**
 * R20
 */
export class TextDimension {
  static totalHeight = 16;
  static actualHeight = 12.7;
  static bottomPadding = 3.3;
  static labelHeight = TextDimension.totalHeight + 1;
  static labelWidth = (word) => TextDimension.widthOfWord(word) + 2;

  /**
   * Calculate the width of ASCII string in `px`.
   *
   * @param {string} word
   * @returns {number}
   */
  static widthOfWord(word) {
    word = word.toString();
    let widthSum = 0;
    for (let i = 0; i < word.length; i++) {
      widthSum += widthOfChar[word.charCodeAt(i) - 32] / 1000;
    }
    return widthSum;
  }

  /**
   * R5
   *
   * @param {string} word
   * @param {{x: number, y: number, width: number, height: number}} rect
   * @returns {{x: number, y: number}}
   */
  static centerWordInRect(word, rect) {
    return {
      x: rect.x + (rect.width - TextDimension.widthOfWord(word)) / 2,
      y:
        rect.y +
        (rect.height + TextDimension.totalHeight) / 2 -
        TextDimension.bottomPadding,
    };
  }
}

/**
 * Width of chars in `1/1000 px`.
 *
 * font-size: `14px`
 *
 * font-weight: `400/700`
 *
 * font-family: `Svg`
 *
 * @example
 * ```
 * widthOfChar[word.charCodeAt(i) - 32] / 1000
 * ```
 */
export const widthOfChar = new Uint16Array([
  //
  3510,
  // !
  3640,
  // "
  4510,
  // #
  8660,
  // $
  7900,
  // %
  10290,
  // &
  8740,
  // '
  2480,
  // (
  4820,
  // )
  4900,
  // *
  6060,
  // +
  7980,
  // ,
  2780,
  // -
  3900,
  // .
  3720,
  // /
  5810,
  // 0
  7890,
  // 1
  7890,
  // 2
  7890,
  // 3
  7890,
  // 4
  7890,
  // 5
  7890,
  // 6
  7890,
  // 7
  7890,
  // 8
  7890,
  // 9
  7890,
  // :
  3420,
  // ;
  3000,
  // <
  7150,
  // =
  7710,
  // >
  7350,
  // ?
  6650,
  // @
  12600,
  // A
  9170,
  // B
  8750,
  // C
  9150,
  // D
  9220,
  // E
  7990,
  // F
  7780,
  // G
  9570,
  // H
  10010,
  // I
  3840,
  // J
  7760,
  // K
  8810,
  // L
  7560,
  // M
  12250,
  // N
  10010,
  // O
  9660,
  // P
  8860,
  // Q
  9660,
  // R
  8650,
  // S
  8330,
  // T
  8390,
  // U
  9110,
  // V
  8940,
  // W
  12450,
  // X
  8810,
  // Y
  8440,
  // Z
  8410,
  // [
  3750,
  // \
  5770,
  // ]
  3750,
  // ^
  5880,
  // _
  6350,
  // `
  4360,
  // a
  7650,
  // b
  7890,
  // c
  7360,
  // d
  7930,
  // e
  7450,
  // f
  4890,
  // g
  7890,
  // h
  7740,
  // i
  3430,
  // j
  3370,
  // k
  7130,
  // l
  3430,
  // m
  12300,
  // n
  7760,
  // o
  8020,
  // p
  7890,
  // q
  7990,
  // r
  4770,
  // s
  7250,
  // t
  4610,
  // u
  7750,
  // v
  6810,
  // w
  10550,
  // x
  6970,
  // y
  6650,
  // z
  6970,
  // {
  4770,
  // |
  3440,
  // }
  4770,
  // ~
  9550,
]);
