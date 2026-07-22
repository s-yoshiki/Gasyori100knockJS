# Gasyori100knockJS

> 画像処理100本ノックを TypeScript と Canvas API だけで解く

[![CI](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/ci.yml/badge.svg)](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/ci.yml)
[![Deploy](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/deploy.yml/badge.svg)](https://github.com/s-yoshiki/Gasyori100knockJS/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**デモ: <https://s-yoshiki.github.io/Gasyori100knockJS/>**

[画像処理100本ノック](https://github.com/yoyoyo-yo/Gasyori100knock)（yoyoyo-yo 氏）の各問題を、
ブラウザ上で動く形で実装したものです。入力画像を切り替えながら、その場で処理結果を確認できます。

- **画像処理ライブラリを使っていません。** すべて `getImageData` / `putImageData` による画素単位の実装です。
- 行列演算（逆行列・アダマール積）もヒストグラム描画も自前実装で、**実行時依存は React と React Router のみ**です。
- 各問題は iframe で外部ページに埋め込めます。

## クイックスタート

```bash
pnpm install
pnpm dev
```

<http://localhost:5173/Gasyori100knockJS/> が開きます。

## スクリプト

| コマンド               | 内容                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `pnpm dev`          | 開発サーバを起動する                                            |
| `pnpm build`        | 型チェックののち `dist/` へ本番ビルドする                       |
| `pnpm preview`      | ビルド結果をローカルで配信する                                  |
| `pnpm typecheck`    | `tsc --noEmit` で型検査する                                     |
| `pnpm lint`         | Biome を実行する（`lint:fix` で自動修正）                      |
| `pnpm format`       | Biome で整形する（`format:check` で検査のみ）                |
| `npm test`             | Vitest を実行する（`test:watch` で監視）                        |
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

100 問中 83 問を実装しています。未実装の問題は一覧ページで「未実装」と表示されます。

## 埋め込み

問題ページの「埋め込みコード」から iframe のスニペットを取得できます。

```html
<iframe
  src="https://s-yoshiki.github.io/Gasyori100knockJS/embed/1"
  style="width:100%;height:520px;border:0"
  loading="lazy"
></iframe>
```

## 参考

> yoyoyo-yo. Gasyori100knock（画像処理100本ノック）
> <https://github.com/yoyoyo-yo/Gasyori100knock>

## ライセンス

[MIT](LICENSE)
