# AGENTS.md

コーディングエージェント向けの作業手引き。人間が読んでも役に立つように書いてあるが、
優先度としては「エージェントが最短で正しく動くこと」を狙っている。

## このリポジトリは何か

画像処理100本ノックの各問題を、ブラウザ上の Canvas 2D API だけで実装したもの。
React はあくまで「canvas を並べて実行ボタンを出す」ための器で、
リポジトリの価値は `src/questions/answers/` にある画素単位の実装にある。

## 最初に押さえるべき制約

- **画像処理ライブラリを追加しない。** OpenCV.js も数値計算ライブラリも入れない。
  行列演算が必要なら `src/lib/matrix.ts` に足す。この方針は意図的なものなので、
  依存を増やす提案をする前に必ず確認を取ること。
- **実行時依存は `react` / `react-dom` / `react-router` の 3 つだけ。** これを増やす変更は
  レビューで落ちる前提で扱う。
- **`src/questions/registry.ts` は自動生成。** 手で編集せず `pnpm gen:registry` を使う。
- **`src/questions/answers/AnsNNN.ts` は問題番号を3桁にゼロ埋めする。** レジストリ生成がファイル名に依存している。

## 変更したら必ず実行するもの

```bash
pnpm check
```

型検査・Biome lint・format 検査・Vitest をまとめて実行する。CI と同じ内容なので、
これが通れば CI も通る。個別に回したい場合は `typecheck` / `lint` / `format:check` / `test`。

`pnpm build` は `tsc --noEmit` を経由するため、ビルドが通ることは型が通ることを含意する。

## アーキテクチャの要点

処理の流れは次の一方向に固定されている。

```
AnswerRunner (React)
  └─ createAnswer(id) で実行オブジェクトを生成
  └─ canvas を layout の枚数だけ生成して渡す
       └─ answer.mount(canvases, image)   初期描画（入力画像の表示など）
       └─ answer.run(canvases, image)     実行ボタン押下時
            └─ main(...)                  ← 各問題が返すアロー関数
```

**`src/questions/` は React を import しない。** この境界を壊さないこと。
UI を差し替えても問題の実装が影響を受けない、というのがこの構成の目的。

ファクトリ関数は `src/questions/base.ts` にある。

| ファクトリ関数                   | canvas | `main()` の引数                      |
| ---------------------------- | ------ | ------------------------------------ |
| `createOneCanvasAnswer`            | 1      | `(canvas)`                           |
| `createTwoCanvasAnswer`            | 2      | `(canvas, image)`                    |
| `createThreeCanvasAnswer`          | 3      | `(canvas1, canvas2, image)`          |
| `createFourCanvasAnswer`           | 4      | `(canvas1, canvas2, canvas3, image)` |
| `createHistogramAnswer`            | 2      | `(canvas, image)` + `renderChart()`  |
| `createThreeCanvasHistogramAnswer` | 3      | `(canvas, image)` + `renderChart()`  |

canvas の 0 枚目は原則「入力画像」であり、`main()` には渡らない（`OneCanvasAnswer` と
`HistogramAnswer` を除く）。詳細は [docs/architecture.md](docs/architecture.md)。

## 問題を追加するとき

[docs/adding-a-question.md](docs/adding-a-question.md) の手順に従う。要約:

1. `src/questions/answers/AnsNNN.ts` を作り、上表のファクトリへ `main` アロー関数を渡す。
2. `src/questions/descriptions.ts` に `N: { title, desc }` を足す。
3. `pnpm gen:registry` を実行する。
4. `pnpm check` を通す。

`descriptions.ts` と `registry.ts` の整合はテストで検証している
（`src/questions/registry.test.ts`）。片方だけ足すと落ちる。

## コードの書き方

- **画像処理コードの中身は既存のスタイルに合わせる。** 添字計算、ビット演算（`~~x`）、
  多重ループの一行書きなどは意図的なもの。「きれいに」書き直すために
  アルゴリズムを触らないこと。
- 一方で **`let` / `const`、型注釈、命名は Biome と型検査に従う。** 自動修正は `pnpm lint:fix`。
- 画素バッファを受けるヘルパの引数は `Pixels` 型（`src/lib/pixels.ts`）を使う。
  `ImageData.data` と `number[]` の両方が渡ってくるため。
- コメントは日本語。既存ファイルの密度に合わせる。

## つまずきやすい点

- **入力画像のパスに相対パスを使わない。** クリーン URL を採用しているので、
  `import.meta.env.BASE_URL` を前置した絶対パスにする（`src/questions/images.ts` 参照）。
- **`requestAnimationFrame` を実行のスケジューリングに使わない。** 非表示タブで発火せず、
  実行が永久に止まる。`setTimeout` を使う。
- **`mount()` で非同期の読み込みをする場合は Promise を返す。** UI 側が完了を待ってから
  実行ボタンを有効化する（`Ans060.ts` が実例）。
- **無限ループを書かない。** ブラウザのタブごと固まる。反復アルゴリズムには必ず
  収束判定か上限回数を入れること。

## 動作確認

ロジックの検証は Vitest では足りない（canvas が必要なため）。実際に見る場合:

```bash
pnpm dev
```

`http://localhost:5173/Gasyori100knockJS/questions/<番号>` を開いて実行ボタンを押す。
埋め込み表示の確認は `/embed/<番号>`。

## 触らないもの

- `public/images/`, `public/dataset/` — 問題で参照している入力画像。差し替えると結果が変わる。
- `src/questions/registry.ts` — 生成物。
- `dist/` — ビルド出力。コミットしない。
