# 問題を追加する

既存問題を差し替える場合や発展問題を追加する場合の手順を示す。以下では Q.46 を例にする。

## 1. レイアウトを決める

「入力画像と結果を並べたい」だけなら `createTwoCanvasAnswer`。
途中経過も見せたいなら `createThreeCanvasAnswer`。選択肢は
[architecture.md のレイアウト表](architecture.md#レイアウト)を参照。

## 2. 解答ファイルを作る

ファイル名は問題番号を3桁にゼロ埋めした `src/questions/answers/AnsNNN.ts` に固定。
レジストリの生成がこの命名に依存している。

```ts
// src/questions/answers/Ans046.ts
import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'

/**
 * Q.46
 * 問題のタイトル
 */
export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      // ここに処理を書く
      dst.data[i] = src.data[i]
      dst.data[i + 1] = src.data[i + 1]
      dst.data[i + 2] = src.data[i + 2]
      dst.data[i + 3] = src.data[i + 3]
    }

    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
```

`canvas.getContext('2d')` は `null` を返しうるので、直接呼ばずに `context2d()` を使う。

### 入力画像を変えたい場合

既定の入力画像（imori）以外を使いたいときは、ファクトリのオプションで指定する。

```ts
import config from '../images'

export default createTwoCanvasAnswer(
  () => {
    // ...
    return { main }
  },
  { imageUrl: config.srcImage.thorino },
)
```

### 数値をログに出したい場合

ファクトリから受け取る `showMessage()` を使う。第 2 引数を `false` にすると、等幅ではなく通常の HTML として表示される。

```ts
export default createTwoCanvasAnswer(({ showMessage }) => {
  // main 内で利用する
  showMessage(`閾値: ${threshold}`)
  return { main }
})
```

### 非同期の準備が必要な場合

追加の画像を読み込むなど、実行前に非同期の準備が要るときは `mount()` を上書きして
Promise を返す。UI 側は解決するまで実行ボタンを押せない状態を保つ。実例は `Ans060.ts`。

## 3. 説明を書く

`src/questions/descriptions.ts` の `questionRows` に番号順でタイトルと説明を追加する。

```ts
  ['問題のタイトル', '出力画像がどうなるかの説明。<code>タグ</code> も使える。'],
```

## 4. レジストリを再生成する

```bash
pnpm gen:registry
```

`src/questions/registry.ts` が更新される。このファイルは生成物なので手で編集しない。

## 5. 確認する

```bash
pnpm check   # 型検査・Lint・整形検査・テスト
pnpm dev     # 実際に動かす
```

`http://localhost:5173/Gasyori100knockJS/questions/46` を開いて実行ボタンを押す。

## 気をつけること

- **無限ループを書かない。** 反復アルゴリズムには収束判定か上限回数を必ず入れる。
  ブラウザのタブごと固まり、ユーザは強制終了するしかなくなる。
- **画像処理ライブラリを追加しない。** 行列演算が要るなら `src/lib/matrix.ts` に足す。
- **重い処理は覚悟して書く。** 実行は同期的に走るため、その間 UI は固まる。
  Canny やハフ変換のような処理でも数百 ms 程度に収まる規模の画像を前提にしている。

## ヘルパを共有したい場合

複数の問題で同じ処理（カーネル適用、グレースケール化など）を使う場合、
一問だけで使う短い処理は各ファイル内に置いている。これは元コードからの引き継ぎで、
「1 問 1 ファイルで完結して読める」ことを優先した結果でもある。

HOG・IoU・NMS・k-means のように複数の連続問題で共有する処理は `src/lib/vision.ts` に置く。
共通化で既存問題の結果が変わらないよう、影響範囲と各段階の出力を確認すること。
