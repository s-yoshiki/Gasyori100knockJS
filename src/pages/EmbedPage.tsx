import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { AnswerRunner } from '@/components/AnswerRunner'
import { getDescription } from '@/questions/descriptions'
import { isImplemented, TOTAL_QUESTIONS } from '@/questions/registry'
import './EmbedPage.css'

/**
 * iframe 埋め込み用の最小構成ページ。
 *
 * ヘッダ・フッタ・問題一覧を持たず、実行部分だけを表示する。
 */
export function EmbedPage() {
  const { id: rawId } = useParams()
  const id = Number(rawId)
  const valid = Number.isInteger(id) && id >= 1 && id <= TOTAL_QUESTIONS && isImplemented(id)
  const { title } = valid ? getDescription(id) : { title: '' }

  useEffect(() => {
    if (valid) {
      document.title = `Q.${id} ${title}`
    }
  }, [id, title, valid])

  if (!valid) {
    return (
      <div className="embed-page">
        <p className="embed-page__empty">指定された問題は存在しません。</p>
      </div>
    )
  }

  return (
    <div className="embed-page">
      <header className="embed-page__header">
        <span className="tag">Q.{id}</span>
        <h1 className="embed-page__title">{title}</h1>
      </header>

      <AnswerRunner key={id} id={id} />

      <footer className="embed-page__footer">
        <Link to={`/questions/${id}`} target="_blank" rel="noreferrer noopener">
          画像処理100本ノック JS で開く ↗
        </Link>
      </footer>
    </div>
  )
}
