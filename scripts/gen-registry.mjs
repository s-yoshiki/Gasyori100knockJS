/**
 * src/questions/answers/AnsN.ts を走査して src/questions/registry.ts を生成する。
 *
 * 解答ファイルを追加・削除したら `npm run gen:registry` を実行する。
 * 手で registry.ts を編集しても動くが、生成し直せば必ず整合が取れる。
 */
import { readdirSync, writeFileSync } from 'node:fs'

const ANSWERS_DIR = 'src/questions/answers'
const OUTPUT = 'src/questions/registry.ts'

const ids = readdirSync(ANSWERS_DIR)
  .filter((file) => /^Ans\d+\.ts$/.test(file))
  .map((file) => Number(file.match(/\d+/)[0]))
  .sort((a, b) => a - b)

if (ids.length === 0) {
  throw new Error(`${ANSWERS_DIR} に解答ファイルが見つかりません`)
}

const imports = ids.map((n) => `import Ans${n} from './answers/Ans${n}'`).join('\n')
const entries = ids.map((n) => `  ${n}: Ans${n},`).join('\n')

const output = `/**
 * 解答レジストリ（自動生成 / DO NOT EDIT）。
 *
 * 問題番号 -> 解答クラスの対応表。ここに載っている番号だけが実行可能な問題として扱われる。
 * 解答ファイルを追加したら \`npm run gen:registry\` で再生成すること。
 *
 * @see docs/adding-a-question.md
 */

import type { BaseAnswer } from './base'
${imports}

/** 問題番号から解答クラス（コンストラクタ）を引く。 */
export const answers: Record<number, new () => BaseAnswer> = {
${entries}
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
`

writeFileSync(OUTPUT, output)
console.log(`${OUTPUT} を生成しました (${ids.length} 問)`)
