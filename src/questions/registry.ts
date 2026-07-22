/**
 * 解答レジストリ（自動生成 / DO NOT EDIT）。
 *
 * 問題番号 -> 解答クラスの対応表。ここに載っている番号だけが実行可能な問題として扱われる。
 * 解答ファイルを追加したら `npm run gen:registry` で再生成すること。
 *
 * @see docs/adding-a-question.md
 */

import type { BaseAnswer } from './base'
import Ans1 from './answers/Ans1'
import Ans2 from './answers/Ans2'
import Ans3 from './answers/Ans3'
import Ans4 from './answers/Ans4'
import Ans5 from './answers/Ans5'
import Ans6 from './answers/Ans6'
import Ans7 from './answers/Ans7'
import Ans8 from './answers/Ans8'
import Ans9 from './answers/Ans9'
import Ans10 from './answers/Ans10'
import Ans11 from './answers/Ans11'
import Ans12 from './answers/Ans12'
import Ans13 from './answers/Ans13'
import Ans14 from './answers/Ans14'
import Ans15 from './answers/Ans15'
import Ans16 from './answers/Ans16'
import Ans17 from './answers/Ans17'
import Ans18 from './answers/Ans18'
import Ans19 from './answers/Ans19'
import Ans20 from './answers/Ans20'
import Ans21 from './answers/Ans21'
import Ans22 from './answers/Ans22'
import Ans23 from './answers/Ans23'
import Ans24 from './answers/Ans24'
import Ans25 from './answers/Ans25'
import Ans26 from './answers/Ans26'
import Ans27 from './answers/Ans27'
import Ans28 from './answers/Ans28'
import Ans29 from './answers/Ans29'
import Ans30 from './answers/Ans30'
import Ans31 from './answers/Ans31'
import Ans32 from './answers/Ans32'
import Ans33 from './answers/Ans33'
import Ans34 from './answers/Ans34'
import Ans35 from './answers/Ans35'
import Ans36 from './answers/Ans36'
import Ans37 from './answers/Ans37'
import Ans38 from './answers/Ans38'
import Ans39 from './answers/Ans39'
import Ans40 from './answers/Ans40'
import Ans41 from './answers/Ans41'
import Ans42 from './answers/Ans42'
import Ans43 from './answers/Ans43'
import Ans44 from './answers/Ans44'
import Ans45 from './answers/Ans45'
import Ans47 from './answers/Ans47'
import Ans48 from './answers/Ans48'
import Ans49 from './answers/Ans49'
import Ans50 from './answers/Ans50'
import Ans51 from './answers/Ans51'
import Ans52 from './answers/Ans52'
import Ans53 from './answers/Ans53'
import Ans54 from './answers/Ans54'
import Ans55 from './answers/Ans55'
import Ans56 from './answers/Ans56'
import Ans57 from './answers/Ans57'
import Ans58 from './answers/Ans58'
import Ans59 from './answers/Ans59'
import Ans60 from './answers/Ans60'
import Ans61 from './answers/Ans61'
import Ans62 from './answers/Ans62'
import Ans63 from './answers/Ans63'
import Ans64 from './answers/Ans64'
import Ans65 from './answers/Ans65'
import Ans70 from './answers/Ans70'
import Ans71 from './answers/Ans71'
import Ans72 from './answers/Ans72'
import Ans73 from './answers/Ans73'
import Ans74 from './answers/Ans74'
import Ans75 from './answers/Ans75'
import Ans76 from './answers/Ans76'
import Ans77 from './answers/Ans77'
import Ans78 from './answers/Ans78'
import Ans79 from './answers/Ans79'
import Ans80 from './answers/Ans80'
import Ans81 from './answers/Ans81'
import Ans82 from './answers/Ans82'
import Ans83 from './answers/Ans83'
import Ans84 from './answers/Ans84'
import Ans85 from './answers/Ans85'
import Ans86 from './answers/Ans86'
import Ans87 from './answers/Ans87'
import Ans88 from './answers/Ans88'

/** 問題番号から解答クラス（コンストラクタ）を引く。 */
export const answers: Record<number, new () => BaseAnswer> = {
  1: Ans1,
  2: Ans2,
  3: Ans3,
  4: Ans4,
  5: Ans5,
  6: Ans6,
  7: Ans7,
  8: Ans8,
  9: Ans9,
  10: Ans10,
  11: Ans11,
  12: Ans12,
  13: Ans13,
  14: Ans14,
  15: Ans15,
  16: Ans16,
  17: Ans17,
  18: Ans18,
  19: Ans19,
  20: Ans20,
  21: Ans21,
  22: Ans22,
  23: Ans23,
  24: Ans24,
  25: Ans25,
  26: Ans26,
  27: Ans27,
  28: Ans28,
  29: Ans29,
  30: Ans30,
  31: Ans31,
  32: Ans32,
  33: Ans33,
  34: Ans34,
  35: Ans35,
  36: Ans36,
  37: Ans37,
  38: Ans38,
  39: Ans39,
  40: Ans40,
  41: Ans41,
  42: Ans42,
  43: Ans43,
  44: Ans44,
  45: Ans45,
  47: Ans47,
  48: Ans48,
  49: Ans49,
  50: Ans50,
  51: Ans51,
  52: Ans52,
  53: Ans53,
  54: Ans54,
  55: Ans55,
  56: Ans56,
  57: Ans57,
  58: Ans58,
  59: Ans59,
  60: Ans60,
  61: Ans61,
  62: Ans62,
  63: Ans63,
  64: Ans64,
  65: Ans65,
  70: Ans70,
  71: Ans71,
  72: Ans72,
  73: Ans73,
  74: Ans74,
  75: Ans75,
  76: Ans76,
  77: Ans77,
  78: Ans78,
  79: Ans79,
  80: Ans80,
  81: Ans81,
  82: Ans82,
  83: Ans83,
  84: Ans84,
  85: Ans85,
  86: Ans86,
  87: Ans87,
  88: Ans88,
}

/** 実装済みの問題番号（昇順）。 */
export const implementedIds: readonly number[] = Object.keys(answers)
  .map(Number)
  .sort((a, b) => a - b)

/** 問題の総数。100本ノックなので 100 で固定。 */
export const TOTAL_QUESTIONS = 100

/** 指定した番号が実装済みかどうか。 */
export function isImplemented(id: number): boolean {
  return id in answers
}

/** 指定した番号の解答インスタンスを生成する。未実装なら null。 */
export function createAnswer(id: number): BaseAnswer | null {
  const Ctor = answers[id]
  return Ctor ? new Ctor() : null
}
