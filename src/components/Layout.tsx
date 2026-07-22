import { Link, NavLink, Outlet } from 'react-router'
import { ThemeToggle } from './ThemeToggle'

const REPOSITORY_URL = 'https://github.com/s-yoshiki/Gasyori100knockJS'
const ORIGINAL_URL = 'https://github.com/yoyoyo-yo/Gasyori100knock'

/** ヘッダとフッタを備えた通常ページの外枠。埋め込みページでは使わない。 */
export function Layout() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="site-header__brand">
            <span className="site-header__mark" aria-hidden="true">
              G
            </span>
            画像処理100本ノック JS
          </Link>
          <nav className="site-header__nav">
            <NavLink to="/questions" className="site-header__link">
              問題一覧
            </NavLink>
            <a
              className="site-header__link"
              href={REPOSITORY_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="site-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            原案:{' '}
            <a href={ORIGINAL_URL} target="_blank" rel="noreferrer noopener">
              yoyoyo-yo / Gasyori100knock
            </a>
          </span>
          <span>
            <a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener">
              ソースコード
            </a>
            {' · '}MIT License
          </span>
        </div>
      </footer>
    </div>
  )
}
