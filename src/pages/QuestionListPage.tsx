import { useEffect } from 'react'
import { QuestionGrid } from '@/components/QuestionGrid'
import { implementedIds, TOTAL_QUESTIONS } from '@/questions/registry'

export function QuestionListPage() {
  useEffect(() => {
    document.title = '問題一覧 | 画像処理100本ノック JS'
  }, [])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <h1 style={{ fontSize: 26 }}>問題一覧</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          全 {TOTAL_QUESTIONS} 問中 {implementedIds.length} 問を実装しています。
        </p>
      </header>
      <QuestionGrid />
    </section>
  )
}
