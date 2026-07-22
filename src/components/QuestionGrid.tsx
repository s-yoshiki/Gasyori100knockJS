import { Link } from 'react-router'
import { getDescription } from '@/questions/descriptions'
import { isImplemented, TOTAL_QUESTIONS } from '@/questions/registry'
import './QuestionGrid.css'

export interface QuestionGridProps {
  /** 現在開いている問題番号。あればハイライトする。 */
  currentId?: number
}

/** 全 100 問をカードで並べる。未実装の番号は押せない状態で見せる。 */
export function QuestionGrid({ currentId }: QuestionGridProps) {
  return (
    <ul className="question-grid">
      {Array.from({ length: TOTAL_QUESTIONS }, (_, index) => index + 1).map((id) => {
        const { title } = getDescription(id)
        const available = isImplemented(id)

        if (!available) {
          return (
            <li key={id} className="question-card question-card--disabled" aria-disabled="true">
              <span className="question-card__number">{id}</span>
              <span className="question-card__title">未実装</span>
            </li>
          )
        }

        return (
          <li key={id}>
            <Link
              to={`/questions/${id}`}
              className={`question-card${id === currentId ? ' question-card--current' : ''}`}
              aria-current={id === currentId ? 'page' : undefined}
            >
              <span className="question-card__number">{id}</span>
              <span className="question-card__title">{title || '（タイトル未設定）'}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
