# コントリビューションガイド

## セットアップ

Node.js 20.19 以上（22 を推奨）が必要です。

```bash
git clone https://github.com/s-yoshiki/Gasyori100knockJS.git
cd Gasyori100knockJS
pnpm install
pnpm dev
```

## 変更を投げる前に

```bash
pnpm check
```

型検査・Biome lint・format 検査・Vitest をまとめて実行します。CI と同じ内容です。
整形の指摘は `pnpm format`、Lint の指摘の多くは `pnpm lint:fix` で自動修正できます。

## 何を変えるか別の手引き

| やりたいこと           | 参照先                                                 |
| ---------------------- | ------------------------------------------------------ |
| 未実装の問題を実装する | [docs/adding-a-question.md](docs/adding-a-question.md) |
| 全体の構成を知る       | [docs/architecture.md](docs/architecture.md)           |
| エージェントで作業する | [AGENTS.md](AGENTS.md)                                 |

## 方針

- **画像処理ライブラリを追加しません。** 「自前で書く」ことがこのリポジトリの主旨です。
  OpenCV.js や数値計算ライブラリを持ち込む提案は、まず Issue で相談してください。
- **実行時依存は最小限に保ちます。** 現在は `react` / `react-dom` / `react-router` の 3 つだけです。
- **既存の画像処理コードのスタイルは尊重します。** 添字計算やビット演算は意図的なものです。
  可読性のためにアルゴリズムを書き換える変更は、結果が変わらないことを示してください。

## コミットメッセージ

特に規約はありませんが、`feat:` / `fix:` / `docs:` / `deps:` のような接頭辞があると読みやすいです。

## ライセンス

このリポジトリへの貢献は [MIT ライセンス](LICENSE)のもとで公開されることに同意したものとみなします。
