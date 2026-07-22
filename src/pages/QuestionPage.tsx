import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { AnswerRunner } from '@/components/AnswerRunner'
import { QuestionGrid } from '@/components/QuestionGrid'
import { getDescription } from '@/questions/descriptions'
import { implementedIds, isImplemented, TOTAL_QUESTIONS } from '@/questions/registry'
import './QuestionPage.css'

/** 実装済みの問題の中で、前後に当たる番号を返す。 */
function neighbours(id: number): { prev?: number; next?: number } {
  const index = implementedIds.indexOf(id)
  if (index === -1) return {}
  return {
    prev: index > 0 ? implementedIds[index - 1] : undefined,
    next: index < implementedIds.length - 1 ? implementedIds[index + 1] : undefined,
  }
}

export function QuestionPage() {
  const { id: rawId } = useParams()
  const id = Number(rawId)

  useEffect(() => {
    if (Number.isInteger(id)) {
      const { title } = getDescription(id)
      document.title = title
        ? `Q.${id} ${title} | 画像処理100本ノック JS`
        : '画像処理100本ノック JS'
    }
  }, [id])

  if (!Number.isInteger(id) || id < 1 || id > TOTAL_QUESTIONS) {
    return <Navigate to="/questions" replace />
  }

  const { title, desc } = getDescription(id)
  const { prev, next } = neighbours(id)
  const available = isImplemented(id)

  return (
    <article className="question">
      <header className="question__header">
        <span className="tag">Q.{id}</span>
        <h1 className="question__title">{title || '（タイトル未設定）'}</h1>
        {desc && (
          // 解説はリポジトリ内で管理している固定の文字列。外部入力は含まれない。
          <div className="question__desc" dangerouslySetInnerHTML={{ __html: desc }} />
        )}
      </header>

      {available ? (
        <AnswerRunner key={id} id={id} />
      ) : (
        <p className="question__unimplemented card">この問題はまだ実装されていません。</p>
      )}

      <nav className="question__pager" aria-label="前後の問題">
        {prev ? (
          <Link to={`/questions/${prev}`} className="question__pager-link">
            <span className="question__pager-dir">← 前の問題</span>
            <span className="question__pager-title">
              Q.{prev} {getDescription(prev).title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/questions/${next}`}
            className="question__pager-link question__pager-link--next"
          >
            <span className="question__pager-dir">次の問題 →</span>
            <span className="question__pager-title">
              Q.{next} {getDescription(next).title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <EmbedSnippet id={id} />

      <section className="question__list">
        <h2 className="question__list-heading">問題一覧</h2>
        <QuestionGrid currentId={id} />
      </section>
    </article>
  )
}

/** ブログ等に貼り付けるための iframe スニペット。 */
function EmbedSnippet({ id }: { id: number }) {
  const [open, setOpen] = useState(false)
  const url = `${window.location.origin}${import.meta.env.BASE_URL}embed/${id}`
  const snippet = `<iframe src="${url}" style="width:100%;height:520px;border:0" loading="lazy"></iframe>`

  return (
    <section className="embed">
      <button type="button" className="button" onClick={() => setOpen((v) => !v)}>
        埋め込みコード {open ? '▲' : '▼'}
      </button>
      {open && (
        <textarea
          className="embed__code"
          readOnly
          value={snippet}
          rows={3}
          onFocus={(e) => e.target.select()}
        />
      )}
    </section>
  )
}
