# アーキテクチャ

## 全体像

このリポジトリの中心は「画像処理の実装」であり、React はそれを表示するための層でしかない。
そのため、依存の向きを次の一方向に固定している。

```
pages/          画面（ルーティング単位）
  ↓
components/     AnswerRunner が canvas を用意して解答を動かす
  ↓
questions/      解答クラス群。React を import しない
  ↓
lib/            canvas / 行列 / ヒストグラム。DOM 以外に依存しない
```

`src/questions/` から `react` を import することは禁止している。この境界があるおかげで、
UI を作り替えても 83 問の実装に手を入れる必要がない。実際、Vue 2 から React への移行では
画像処理のロジックを一行も変えていない。

## 解答クラスのライフサイクル

`AnswerRunner` が次の順で解答を扱う。

```
createAnswer(id)                    レジストリからインスタンスを作る
  ↓
answer.attach(host)                 showMessage() の出力先を注入する
  ↓
answer.layout を見て canvas を N 枚描画する
  ↓
loadImage(answer.getSrcImage())     入力画像を読み込む
  ↓
await answer.mount(canvases, image) 初期描画。Promise を返してもよい
  ↓ （ここで実行ボタンが押せるようになる）
answer.run(canvases, image)         実行ボタン押下時
  ↓
answer.main(...)                    各問題が実装する唯一のメソッド
```

`mount()` と `run()` はレイアウト別の基底クラスが実装済みで、
個々の問題が書くのは `main()` だけになっている。

## レイアウト

解答は「canvas を何枚どう使うか」を `layout` で宣言する。`AnswerRunner` はこれを見て
canvas の枚数・並び・ラベルを決める。

| layout                   | 枚数 | canvas の役割                  | `main()` に渡るもの             |
| ------------------------ | ---- | ------------------------------ | ------------------------------- |
| `one-canvas`             | 1    | 出力のみ（入力画像を使わない） | `(canvas)`                      |
| `two-canvas`             | 2    | 入力 / 出力                    | `(出力, image)`                 |
| `three-canvas`           | 3    | 入力 / 出力1 / 出力2           | `(出力1, 出力2, image)`         |
| `four-canvas`            | 4    | 入力 / 出力1 / 出力2 / 出力3   | `(出力1, 出力2, 出力3, image)`  |
| `histogram`              | 2    | 入力 / グラフ                  | `(入力, image)` ※画素を読むため |
| `three-canvas-histogram` | 3    | 入力 / 出力 / グラフ           | `(出力, image)`                 |

`one-canvas` はガボールフィルタのカーネル可視化（Q.77〜80）や、
canvas を作業領域としてしか使わない識別系（Q.84〜88）で使う。

## ライブラリを持たない理由と、その代替

移行前は chart.js と mathjs に依存していたが、使っていた機能はごく一部だった。
どちらも自前実装に置き換えてある。

| 旧依存   | 使っていた機能                      | 置き換え先                                      |
| -------- | ----------------------------------- | ----------------------------------------------- |
| chart.js | 棒グラフ 1 種類                     | `src/lib/histogram.ts`（Canvas 2D で直接描画）  |
| mathjs   | `inv` / `dotDivide` / `dotMultiply` | `src/lib/matrix.ts`（ガウス・ジョルダン法ほか） |
| math     | （未使用）                          | 削除                                            |

`histogram.ts` は色を CSS カスタムプロパティから読むため、ライト/ダークテーマに追従する。

## 画素バッファの型

画素の並びは、`ImageData.data`（`Uint8ClampedArray`）で渡ってくる場合と、
中間結果として作った `number[]` の場合がある。添字の読み書きと `length` しか使わない
ヘルパは `Pixels` 型（`src/lib/pixels.ts`）で受ける。

```ts
export type Pixels = number[] | ImageData['data']
```

`slice()` や `map()` を呼ぶ必要がある場合は `number[]` に限定する。

## ルーティングと配信

| パス             | 画面                             |
| ---------------- | -------------------------------- |
| `/`              | トップ                           |
| `/questions`     | 問題一覧                         |
| `/questions/:id` | 問題ページ                       |
| `/embed/:id`     | 埋め込み用（ヘッダ・フッタなし） |

GitHub Pages はプロジェクトページのため、パスの先頭にリポジトリ名が付く。
Vite の `base` と React Router の `basename` の両方に `import.meta.env.BASE_URL` を通している。

またクリーン URL を使っているので、直接アクセスされたパスをサーバが解決できない。
GitHub Pages が未知のパスに対して `404.html` を返す性質を利用し、ビルド時に
`index.html` を `404.html` として複製している（`vite.config.ts` の `githubPagesSpaFallback`）。

## テストの方針

canvas を伴う処理は jsdom では検証できないため、Vitest では次の 2 つに絞っている。

- `src/lib/matrix.test.ts` — 行列演算の数値的な正しさ
- `src/questions/registry.test.ts` — レジストリと説明文の整合、全解答のインスタンス化

画像処理そのものの検証は、開発サーバ上で実際に実行して目視で確認する。
