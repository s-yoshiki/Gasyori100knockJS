import { readdirSync, writeFileSync } from 'node:fs'

const answersDirectory = 'src/questions/answers'
const outputPath = 'src/questions/registry.ts'

const answers = readdirSync(answersDirectory)
  .flatMap((filename) => {
    const match = /^Ans(\d{3})\.ts$/.exec(filename)
    return match ? [{ id: Number(match[1]), suffix: match[1] }] : []
  })
  .sort((a, b) => a.id - b.id)

if (answers.length === 0) throw new Error(`${answersDirectory} に解答ファイルが見つかりません`)

const imports = answers
  .map(({ suffix }) => `import Ans${suffix} from './answers/Ans${suffix}'`)
  .join('\n')
const entries = answers.map(({ id, suffix }) => `  ${id}: Ans${suffix},`).join('\n')

const output = `/** 解答レジストリ（自動生成 / DO NOT EDIT）。 */
import type { AnswerFactory } from './base'
${imports}

export const answers: Readonly<Record<number, AnswerFactory>> = {
${entries}
}

export const implementedIds: readonly number[] = Object.keys(answers)
  .map(Number)
  .sort((a, b) => a - b)

export const TOTAL_QUESTIONS = 100

export const isImplemented = (id: number): boolean => id in answers

export const createAnswer = (id: number) => answers[id]?.() ?? null
`

writeFileSync(outputPath, output)
console.log(`${outputPath} を生成しました (${answers.length} 問)`)
