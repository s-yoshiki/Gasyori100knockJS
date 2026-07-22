import { describe, expect, it } from 'vitest'
import { descriptions } from './descriptions'
import { createAnswer, implementedIds, isImplemented, TOTAL_QUESTIONS } from './registry'

describe('レジストリ', () => {
  it('問題番号は 1〜100 の範囲に収まっている', () => {
    for (const id of implementedIds) {
      expect(id).toBeGreaterThanOrEqual(1)
      expect(id).toBeLessThanOrEqual(TOTAL_QUESTIONS)
    }
  })

  it('昇順に並んでいる', () => {
    expect([...implementedIds].sort((a, b) => a - b)).toEqual([...implementedIds])
  })

  it('登録された全問題のインスタンスを生成でき、レイアウトを宣言している', () => {
    for (const id of implementedIds) {
      const answer = createAnswer(id)
      expect(answer, `Q.${id} のインスタンス生成に失敗`).not.toBeNull()
      expect(answer!.layout, `Q.${id} のレイアウトが未定義`).toBeTruthy()
      expect(answer!.getSrcImage(), `Q.${id} の入力画像が未設定`).toBeTruthy()
    }
  })

  it('未登録の番号は null を返す', () => {
    expect(createAnswer(9999)).toBeNull()
    expect(isImplemented(9999)).toBe(false)
  })

  it('実装済みの問題にはすべて説明が用意されている', () => {
    const missing = implementedIds.filter((id) => !descriptions[id])
    expect(missing, `説明が無い問題: ${missing.join(', ')}`).toEqual([])
  })

  it('説明だけがあって実装が無い番号は残っていない', () => {
    const orphans = Object.keys(descriptions)
      .map(Number)
      .filter((id) => !isImplemented(id))
    expect(orphans, `実装が無い説明: ${orphans.join(', ')}`).toEqual([])
  })

  it('すべての説明にタイトルがある', () => {
    for (const id of implementedIds) {
      expect(descriptions[id].title, `Q.${id} のタイトルが空`).not.toBe('')
    }
  })
})
