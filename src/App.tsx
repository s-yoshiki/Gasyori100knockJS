import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { EmbedPage } from './pages/EmbedPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { QuestionListPage } from './pages/QuestionListPage'
import { QuestionPage } from './pages/QuestionPage'

/**
 * ルーティング。
 *
 * GitHub Pages ではリポジトリ名がパスの先頭に付くため、BASE_URL を basename に渡す。
 * 未知のパスは 404.html（= index.html の複製）が返るので、SPA 側で解決できる。
 */
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* 埋め込み用。ヘッダ・フッタを持たない */}
        <Route path="/embed/:id" element={<EmbedPage />} />

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="questions" element={<QuestionListPage />} />
          <Route path="questions/:id" element={<QuestionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
