import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-7) 0',
      }}
    >
      <h1 style={{ fontSize: 26 }}>ページが見つかりません</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        URL が変更された可能性があります。問題一覧から探してみてください。
      </p>
      <Link to="/questions" className="button button--primary">
        問題一覧へ
      </Link>
    </section>
  )
}
