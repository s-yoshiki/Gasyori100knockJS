/**
 * 各問題のタイトルと解説。
 *
 * `desc` は信頼できるリポジトリ内の文字列で、`<code>` などの簡単なタグを含む。
 * 表示側は HTML として解釈するため、外部入力をここに混ぜないこと。
 */

export interface QuestionDescription {
  /** 問題のタイトル。一覧・ページ見出し・ページネーションで使う。 */
  title: string
  /** 解説文。簡単な HTML タグを含みうる。 */
  desc: string
}

export const descriptions: Record<number, QuestionDescription> = {
  1: {
    title: 'チャンネル入れ替え',
    desc: `画像を読み込み、RGBをBGRの順に入れ替える。左の画像が入力画像。右の画像が処理後の画像。`,
  },
  2: {
    title: 'グレースケール',
    desc: `画像の輝度表現方法の一種であり次の式で計算される。
    <code>Y = 0.2126 R + 0.7152 G + 0.0722 B</code>`,
  },
  3: {
    title: '二値化',
    desc: 'グレースケールに変換された画像の各画素の値が閾値未満であれば0、閾値以上であれば255に変換する。ここで閾値は128としている。',
  },
  4: {
    title: '大津の二値化',
    desc: '',
  },
  5: {
    title: 'HSV変換',
    desc: '出力画像は色相Hを反転(180を加算)し、RGB画像に変換したものである。',
  },
  6: {
    title: '減色処理',
    desc: '出力画像は[32, 96, 160, 224]の4色に減色したものである。',
  },
  7: {
    title: '平均プーリング',
    desc: '出力画像は8x8にグリッド分割された平均プーリングである',
  },
  8: {
    title: 'Maxプーリング',
    desc: '',
  },
  9: {
    title: 'ガウシアンフィルタ',
    desc: '出力画像は、3x3かつ標準偏差1.3のカーネルを用いて平滑化されたものである。',
  },
  10: {
    title: 'メディアンフィルタ',
    desc: '入力画像の注目画素の3x3の中央値を利用している。',
  },
  11: {
    title: '平滑化フィルタ',
    desc: `フィルタは次式を用いている。
<pre><code>[[1/3, 0, 0],
[0, 1/3, 0],
[0, 0, 1/3]]</code></pre>`,
  },
  12: {
    title: 'モーションフィルタ',
    desc: '',
  },
  13: {
    title: 'MAX-MINフィルタ',
    desc: '',
  },
  14: {
    title: '微分フィルタ',
    desc: '',
  },
  15: {
    title: 'Sobelフィルタ',
    desc: '',
  },
  16: {
    title: 'Prewittフィルタ',
    desc: '',
  },
  17: {
    title: 'Laplacianフィルタ',
    desc: '',
  },
  18: {
    title: 'Embossフィルタ',
    desc: '',
  },
  19: {
    title: 'LoGフィルタ',
    desc: '',
  },
  20: {
    title: 'ヒストグラム表示',
    desc: '',
  },
  21: {
    title: 'ヒストグラム正規化',
    desc: '',
  },
  22: {
    title: 'ヒストグラム操作',
    desc: '',
  },
  23: {
    title: 'ヒストグラム平坦化',
    desc: '',
  },
  24: {
    title: 'ガンマ補正',
    desc: '',
  },
  25: {
    title: '最近傍補間',
    desc: '',
  },
  26: {
    title: 'Bi-linear補間',
    desc: '',
  },
  27: {
    title: 'Bi-cubic補間',
    desc: '',
  },
  28: {
    title: 'アフィン変換(平行移動)',
    desc: '',
  },
  29: {
    title: 'アフィン変換(拡大縮小)',
    desc: '',
  },
  30: {
    title: 'アフィン変換(回転)',
    desc: '',
  },
  31: {
    title: 'アフィン変換(スキュー)',
    desc: '',
  },
  32: {
    title: 'フーリエ変換',
    desc: '※結果算出までの時間が環境によっては1分以上かかります',
  },
  33: {
    title: 'フーリエ変換 ローパスフィルタ',
    desc: '※結果算出までの時間が環境によっては1分以上かかります',
  },
  34: {
    title: 'フーリエ変換 ハイパスフィルタ',
    desc: '※結果算出までの時間が環境によっては1分以上かかります',
  },
  35: {
    title: 'フーリエ変換 バンドパスフィルタ',
    desc: '※結果算出までの時間が環境によっては1分以上かかります',
  },
  36: {
    title: 'JPEG圧縮 (Step.1)離散コサイン変換',
    desc: '',
  },
  37: {
    title: 'PSNR',
    desc: '',
  },
  38: {
    title: 'JPEG圧縮 (Step.2)DCT+量子化',
    desc: '',
  },
  39: {
    title: 'JPEG圧縮 (Step.3)YCbCr表色系',
    desc: '',
  },
  40: {
    title: 'JPEG圧縮 (Step.4)YCbCr+DCT+量子化',
    desc: '',
  },
  41: {
    title: 'Cannyエッジ検出 (Step.1) エッジ強度',
    desc: '',
  },
  42: {
    title: 'Cannyエッジ検出 (Step.2) 細線化',
    desc: '',
  },
  43: {
    title: 'Cannyエッジ検出 (Step.3) ヒステリシス閾処理',
    desc: '',
  },
  44: {
    title: 'Hough変換・直線検出 (Step.1) Hough変換',
    desc: '',
  },
  45: {
    title: 'Hough変換・直線検出 (Step.2) NMS',
    desc: '',
  },
  47: {
    title: 'モルフォロジー処理(膨張)',
    desc: '',
  },
  48: {
    title: 'モルフォロジー処理(収縮)',
    desc: '',
  },
  49: {
    title: 'オープニング処理',
    desc: '',
  },
  50: {
    title: 'クロージング処理',
    desc: '',
  },
  51: {
    title: 'モルフォロジー勾配',
    desc: '',
  },
  52: {
    title: 'トップハット変換',
    desc: '',
  },
  53: {
    title: 'ブラックハット変換',
    desc: '',
  },
  54: {
    title: 'テンプレートマッチング SSD',
    desc: '',
  },
  55: {
    title: 'テンプレートマッチング SAD',
    desc: '',
  },
  56: {
    title: 'テンプレートマッチング NCC',
    desc: '',
  },
  57: {
    title: 'テンプレートマッチング ZNCC',
    desc: '',
  },
  58: {
    title: 'ラベリング 4近傍',
    desc: '',
  },
  59: {
    title: 'ラベリング 8近傍',
    desc: '',
  },
  60: {
    title: 'アルファブレンド',
    desc: '',
  },
  61: {
    title: '4-連結数',
    desc: '',
  },
  62: {
    title: '8-連結数',
    desc: '',
  },
  63: {
    title: '細線化処理',
    desc: '',
  },
  64: {
    title: 'ヒルディッチの細線化',
    desc: '',
  },
  65: {
    title: 'Zhang-Suenの細線化',
    desc: '',
  },
  70: {
    title: 'カラートラッキング',
    desc: '',
  },
  71: {
    title: 'マスキング',
    desc: '',
  },
  72: {
    title: 'マスキング(カラートラッキング＋モルフォロジー)',
    desc: '',
  },
  73: {
    title: '縮小と拡大',
    desc: '',
  },
  74: {
    title: 'ピラミッド差分による高周波成分の抽出',
    desc: '',
  },
  75: {
    title: 'ガウシアンピラミッド',
    desc: '',
  },
  76: {
    title: '顕著性マップ',
    desc: '',
  },
  77: {
    title: 'ガボールフィルタ',
    desc: '',
  },
  78: {
    title: 'ガボールフィルタの回転',
    desc: '',
  },
  79: {
    title: 'ガボールフィルタによるエッジ抽出',
    desc: '',
  },
  80: {
    title: 'ガボールフィルタによる特徴抽出',
    desc: '',
  },
  81: {
    title: 'Hessianのコーナー検出',
    desc: '',
  },
  82: {
    title: 'Harrisのコーナー検出 (Step.1) Sobel + Gauusian',
    desc: '',
  },
  83: {
    title: 'Harrisのコーナー検出 (Step.2) コーナー検出',
    desc: '',
  },
  84: {
    title: '簡単な画像認識 (Step.1) 減色化 + ヒストグラム',
    desc: '',
  },
  85: {
    title: '簡単な画像認識 (Step.2) クラス判別',
    desc: '',
  },
  86: {
    title: '簡単な画像認識 (Step.3) 評価(Accuracy)',
    desc: '',
  },
  87: {
    title: '簡単な画像認識 (Step.4) k-NN',
    desc: '',
  },
  88: {
    title: 'K-means (Step.1) 重心作成',
    desc: '',
  },
}

/** 指定した番号の説明を返す。未登録ならタイトル・解説とも空。 */
export function getDescription(id: number): QuestionDescription {
  return descriptions[id] ?? { title: '', desc: '' }
}

export default descriptions
