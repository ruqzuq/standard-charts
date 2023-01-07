/**
 ASCII (C0 Controls and Basic Latin):
 32-126
 */

/**
 * R20
 */
export class TextDimension {
  static totalHeight = 18;
  static actualHeight = 14.67;
  static bottomPadding = 3.33;
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
  // SPACE
  3970,
  // !
  4130,
  // "
  5130,
  // #
  9860,
  // $
  9000,
  // %
  11730,
  // &
  9960,
  // '
  2800,
  // (
  5490,
  // )
  5570,
  // *
  6900,
  // +
  9080,
  // ,
  3140,
  // -
  4420,
  // .
  4220,
  // /
  6600,
  // 0
  8990,
  // 1
  8990,
  // 2
  8990,
  // 3
  8990,
  // 4
  8990,
  // 5
  8990,
  // 6
  8990,
  // 7
  8990,
  // 8
  8990,
  // 9
  8990,
  // :
  3880,
  // ;
  3390,
  // <
  8140,
  // =
  8780,
  // >
  8360,
  // ?
  7560,
  // @
  14370,
  // A
  10440,
  // B
  9960,
  // C
  10420,
  // D
  10490,
  // E
  9100,
  // F
  8840,
  // G
  10900,
  // H
  11400,
  // I
  4360,
  // J
  8820,
  // K
  10040,
  // L
  8610,
  // M
  13970,
  // N
  11400,
  // O
  11000,
  // P
  10090,
  // Q
  10990,
  // R
  9850,
  // S
  9490,
  // T
  9550,
  // U
  10370,
  // V
  10180,
  // W
  14190,
  // X
  10030,
  // Y
  9610,
  // Z
  9580,
  // [
  4240,
  // \
  6580,
  // ]
  4250,
  // ^
  6690,
  // _
  7220,
  // `
  4950,
  // a
  8710,
  // b
  8970,
  // c
  8380,
  // d
  9030,
  // e
  8480,
  // f
  5560,
  // g
  8980,
  // h
  8820,
  // i
  3880,
  // j
  3820,
  // k
  8120,
  // l
  3880,
  // m
  14020,
  // n
  8840,
  // o
  9130,
  // p
  8980,
  // q
  9100,
  // r
  5420,
  // s
  8260,
  // t
  5230,
  // u
  8820,
  // v
  7750,
  // w
  12020,
  // x
  7940,
  // y
  7570,
  // z
  7930,
  // {
  5420,
  // |
  3900,
  // }
  5420,
  // ~
  10900,
]);
