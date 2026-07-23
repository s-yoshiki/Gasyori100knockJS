# Gasyori100knockJS

> 画像処理100本ノックを TypeScript と Canvas API だけで解く

[![CI](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/ci.yml/badge.svg)](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/ci.yml)
[![Deploy](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/deploy.yml/badge.svg)](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**デモ: <https://gasyori100knock-js.s-yoshiki.com/>**

[画像処理100本ノック](https://github.com/ryoppippi/Gasyori100knock)の各問題を、
ブラウザ上で動く形で実装したものです。入力画像を切り替えながら、その場で処理結果を確認できます。

- **画像処理ライブラリを使っていません。** すべて `getImageData` / `putImageData` による画素単位の実装です。
- 行列演算（逆行列・アダマール積）もヒストグラム描画も自前実装で、**実行時依存は React と React Router のみ**です。
- 各問題は iframe で外部ページに埋め込めます。
- **Q.1〜Q.100 をすべて実装済みです。** 基本的な画素操作から物体検出の評価まで順番に試せます。

## 収録内容

| 問題        | 主なテーマ                                                   |
| ----------- | ------------------------------------------------------------ |
| Q.1〜10     | 色変換、二値化、プーリング、平滑化                           |
| Q.11〜20    | 空間フィルタ、エッジ、ヒストグラム                           |
| Q.21〜30    | 濃度変換、補間、アフィン変換                                 |
| Q.31〜40    | フーリエ変換、DCT、JPEG圧縮                                  |
| Q.41〜50    | Canny、Hough変換、モルフォロジー                             |
| Q.51〜60    | 形態学的変換、テンプレート照合、ラベリング                   |
| Q.61〜70    | 連結数、細線化、HOG、色追跡                                  |
| Q.71〜80    | マスキング、画像ピラミッド、顕著性、ガボールフィルタ         |
| Q.81〜90    | コーナー検出、色ヒストグラム認識、k-NN、k-means              |
| Q.91〜100   | k-means減色、IoU、ニューラルネット、物体検出、NMS、評価指標  |

各問題ページには、処理の目的、アルゴリズム上の要点、入力と出力の canvas を掲載しています。
学習の進め方と用語のつながりは [学習ガイド](docs/learning-guide.md) にまとめています。

## クイックスタート

```bash
pnpm install
pnpm dev
```

<http://localhost:5173/> が開きます。

## スクリプト

| コマンド               | 内容                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `pnpm dev`          | 開発サーバを起動する                                            |
| `pnpm build`        | 型チェックののち `dist/` へ本番ビルドする                       |
| `pnpm preview`      | ビルド結果をローカルで配信する                                  |
| `pnpm typecheck`    | `tsc --noEmit` で型検査する                                     |
| `pnpm lint`         | Biome を実行する（`lint:fix` で自動修正）                      |
| `pnpm format`       | Biome で整形する（`format:check` で検査のみ）                |
| `pnpm test`          | Vitest を実行する（`test:watch` で監視）                        |
| `pnpm gen:registry` | 解答ファイルを走査して `src/questions/registry.ts` を再生成する |
| `pnpm check`        | 型検査・Lint・整形検査・テストをまとめて実行する                |

変更を投げる前に `pnpm check` が通ることを確認してください。CI も同じものを実行します。

## ディレクトリ構成

```
src/
├── lib/                    UI に依存しない汎用処理
│   ├── canvas.ts             canvas / 画像読み込みのユーティリティ
│   ├── histogram.ts          ヒストグラムの描画（旧 chart.js の置き換え）
│   ├── matrix.ts             逆行列・要素ごとの積と商（旧 mathjs の置き換え）
│   └── pixels.ts             画素バッファまわりの共通型
├── questions/              問題そのもの
│   ├── base.ts               解答ファクトリ群（React 非依存）
│   ├── images.ts             入力画像とデータセットのパス
│   ├── descriptions.ts       各問題のタイトルと解説
│   ├── registry.ts           問題番号 -> 解答ファクトリ（自動生成）
│   └── answers/AnsNNN.ts     各問題の実装（3桁ゼロ埋め）
├── components/             React コンポーネント
│   └── AnswerRunner.tsx      canvas の配置と実行を担う中核
├── pages/                  ルーティング単位の画面
└── styles/global.css       デザイントークンと土台のスタイル
```

設計の考え方は [docs/architecture.md](docs/architecture.md) を参照してください。

## 問題を追加・修正するには

[docs/adding-a-question.md](docs/adding-a-question.md) に手順をまとめています。要点は次の 2 つです。

1. `src/questions/answers/AnsNNN.ts` でレイアウト別ファクトリに `main` アロー関数を渡す。
2. `pnpm gen:registry` を実行してレジストリを更新する。

## 実装状況

**100 問すべて実装済みです。** 問題一覧から任意の番号を選び、「実行」を押すと結果を確認できます。

Q.32〜35 の離散フーリエ変換や、Q.97〜100 のスライディングウィンドウは計算量が多いため、
端末によっては完了まで数秒以上かかります。反復処理には収束判定または上限を設けています。

## 埋め込み

問題ページの「埋め込みコード」から iframe のスニペットを取得できます。

```html
<iframe
  src="https://gasyori100knock-js.s-yoshiki.com/embed/1"
  style="width:100%;height:520px;border:0"
  loading="lazy"
></iframe>
```

## 参考

> ryoppippi. Gasyori100knock（画像処理100本ノック）
> <https://github.com/ryoppippi/Gasyori100knock>

## ライセンス

[MIT](LICENSE)
