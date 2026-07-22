# 問題を追加する

Q.46 を例に、未実装の問題を追加する手順を示す。

## 1. レイアウトを決める

「入力画像と結果を並べたい」だけなら `TwoCanvasAnswer`。
途中経過も見せたいなら `ThreeCanvasAnswer`。選択肢は
[architecture.md のレイアウト表](architecture.md#レイアウト)を参照。

## 2. 解答ファイルを作る

ファイル名は `src/questions/answers/Ans<問題番号>.ts` に固定。
レジストリの生成がこの命名に依存している。

```ts
// src/questions/answers/Ans46.ts
import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'

/**
 * Q.46
 * 問題のタイトル
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
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
}
```

`canvas.getContext('2d')` は `null` を返しうるので、直接呼ばずに `context2d()` を使う。

### 入力画像を変えたい場合

既定の入力画像（imori）以外を使いたいときは、コンストラクタで指定する。

```ts
import config from '../images'

export default class extends TwoCanvasAnswer {
  constructor() {
    super()
    this.setSrcImage(config.srcImage.thorino)
  }
  // ...
}
```

### 数値をログに出したい場合

`this.showMessage()` を使う。第 2 引数を `false` にすると、等幅ではなく通常の HTML として表示される。

```ts
this.showMessage(`閾値: ${threshold}`)
```

### 非同期の準備が必要な場合

追加の画像を読み込むなど、実行前に非同期の準備が要るときは `mount()` を上書きして
Promise を返す。UI 側は解決するまで実行ボタンを押せない状態を保つ。実例は `Ans60.ts`。

## 3. 説明を書く

`src/questions/descriptions.ts` に追記する。キーは問題番号。

```ts
  46: {
    title: '問題のタイトル',
    desc: '出力画像がどうなるかの説明。<code>タグ</code> も使える。',
  },
```

## 4. レジストリを再生成する

```bash
npm run gen:registry
```

`src/questions/registry.ts` が更新される。このファイルは生成物なので手で編集しない。

## 5. 確認する

```bash
npm run check   # 型検査・Lint・整形検査・テスト
npm run dev     # 実際に動かす
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
現状は各ファイルにコピーが置かれている。これは元コードからの引き継ぎで、
「1 問 1 ファイルで完結して読める」ことを優先した結果でもある。

共通化する場合は `src/lib/` に置き、既存の問題を巻き込んで変更することになるため、
影響範囲を確認してから進めること。
