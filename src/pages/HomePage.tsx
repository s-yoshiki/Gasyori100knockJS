import { Link } from 'react-router'
import { implementedIds, TOTAL_QUESTIONS } from '@/questions/registry'
import './HomePage.css'

const ORIGINAL_URL = 'https://github.com/ryoppippi/Gasyori100knock'
const REPOSITORY_URL = 'https://github.com/s-yoshiki/Gasyori100knockJS'

export function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">
          画像処理100本ノックを
          <br />
          ブラウザで動かす
        </h1>
        <p className="hero__lead">
          <a href={ORIGINAL_URL} target="_blank" rel="noreferrer noopener">
            画像処理100本ノック
          </a>
          （yoyoyo-yo 氏）の各問題を TypeScript と Canvas API だけで実装しました。
          Q.1からQ.100まで、入力画像を切り替えながらその場で結果を確認できます。
        </p>
        <div className="hero__actions">
          <Link to="/questions" className="button button--primary">
            問題一覧を見る
          </Link>
          <a href={REPOSITORY_URL} className="button" target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
        </div>
      </section>

      <section className="home__section">
        <h2 className="home__heading">試し方</h2>
        <ol className="home__steps">
          <li className="card">
            <strong>問題を選ぶ</strong>
            <span>一覧は色・フィルタ・変換・特徴量・認識へ段階的に進みます。</span>
          </li>
          <li className="card">
            <strong>入力を選んで実行</strong>
            <span>既定画像のほか、ノイズ画像やセグメンテーション画像でも比較できます。</span>
          </li>
          <li className="card">
            <strong>途中結果を読む</strong>
            <span>canvas と数値ログを見比べ、前の問題の処理がどう再利用されるか確認します。</span>
          </li>
        </ol>
      </section>

      <section className="stats">
        <div className="stat card">
          <span className="stat__value">{implementedIds.length}</span>
          <span className="stat__label">実装済みの問題</span>
        </div>
        <div className="stat card">
          <span className="stat__value">{TOTAL_QUESTIONS}</span>
          <span className="stat__label">全問題数</span>
        </div>
        <div className="stat card">
          <span className="stat__value">0</span>
          <span className="stat__label">画像処理ライブラリ依存</span>
        </div>
      </section>

      <section className="home__section">
        <h2 className="home__heading">このサイトについて</h2>
        <ul className="home__list">
          <li>
            すべての処理は <code>CanvasRenderingContext2D</code> の <code>getImageData</code> /{' '}
            <code>putImageData</code> を使い、画素単位で実装しています。
          </li>
          <li>
            OpenCV や数値計算ライブラリは使っていません。行列演算やヒストグラム描画も自前実装です。
          </li>
          <li>
            各問題は iframe で外部ページに埋め込めます（問題ページの「埋め込みコード」から）。
          </li>
          <li>
            Q.97〜100では、HOG、ニューラルネット、NMS、評価指標をつないだ物体検出の流れをブラウザだけで実行します。
          </li>
        </ul>
      </section>

      <section className="home__section">
        <h2 className="home__heading">参考</h2>
        <blockquote className="home__quote">
          ryoppippi. Gasyori100knock（画像処理100本ノック）
          <br />
          <a href={ORIGINAL_URL} target="_blank" rel="noreferrer noopener">
            {ORIGINAL_URL}
          </a>
        </blockquote>
      </section>
    </div>
  )
}
