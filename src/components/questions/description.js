export default {
  ans1: {
    title: "チャンネル入れ替え",
    desc: `画像を読み込み、RGBをBGRの順に入れ替える。左の画像が入力画像。右の画像が処理後の画像。`
  },
  ans2: {
    title: "グレースケール",
    desc: `画像の輝度表現方法の一種であり次の式で計算される。
    <code>Y = 0.2126 R + 0.7152 G + 0.0722 B</code>`
  },
  ans3: {
    title: "二値化",
    desc: "グレースケールに変換された画像の各画素の値が閾値未満であれば0、閾値以上であれば255に変換する。ここで閾値は128としている。",
  },
  ans4: {
    title: "大津の二値化",
    desc: "",
  },
  ans5: {
    title: "HSV変換",
    desc: "出力画像は色相Hを反転(180を加算)し、RGB画像に変換したものである。",
  },
  ans6: {
    title: "減色処理",
    desc: "出力画像は[32, 96, 160, 224]の4色に減色したものである。",
  },
  ans7: {
    title: "平均プーリング",
    desc: "出力画像は8x8にグリッド分割された平均プーリングである",
  },
  ans8: {
    title: "Maxプーリング",
    desc: "",
  },
  ans9: {
    title: "ガウシアンフィルタ",
    desc: "出力画像は、3x3かつ標準偏差1.3のカーネルを用いて平滑化されたものである。",
  },
  ans10: {
    title: "メディアンフィルタ",
    desc: "入力画像の注目画素の3x3の中央値を利用している。",
  },
  ans11: {
    title: "平滑化フィルタ",
    desc: `フィルタは次式を用いている。
<pre><code>[[1/3, 0, 0],
[0, 1/3, 0],
[0, 0, 1/3]]</code></pre>`,
  },
  ans12: {
    title: "モーションフィルタ",
    desc: "",
  },
  ans13: {
    title: "MAX-MINフィルタ",
    desc: "",
  },
  ans14: {
    title: "微分フィルタ",
    desc: "",
  },
  ans15: {
    title: "Sobelフィルタ",
    desc: "",
  },
  ans16: {
    title: "Prewittフィルタ",
    desc: "",
  },
  ans17: {
    title: "Laplacianフィルタ",
    desc: "",
  },
  ans18: {
    title: "Embossフィルタ",
    desc: "",
  },
  ans19: {
    title: "LoGフィルタ",
    desc: "",
  },
  ans20: {
    title: "ヒストグラム表示",
    desc: "",
  },
  ans21: {
    title: "ヒストグラム正規化",
    desc: "",
  },
  ans22: {
    title: "ヒストグラム操作",
    desc: "",
  },
  ans23: {
    title: "ヒストグラム平坦化",
    desc: "",
  },
  ans24: {
    title: "ガンマ補正",
    desc: "",
  },
  ans25: {
    title: "最近傍補間",
    desc: "",
  },
  ans26: {
    title: "Bi-linear補間",
    desc: "",
  },
  ans27: {
    title: "Bi-cubic補間",
    desc: "",
  },
  ans28: {
    title: "アフィン変換(平行移動)",
    desc: "",
  },
  ans29: {
    title: "アフィン変換(拡大縮小)",
    desc: "",
  },
  ans30: {
    title: "アフィン変換(回転)",
    desc: "",
  },
  ans31: {
    title: "アフィン変換(スキュー)",
    desc: "",
  },
  ans32: {
    title: "フーリエ変換",
    desc: "※結果算出までの時間が環境によっては1分以上かかります",
  },
  ans33: {
    title: "フーリエ変換 ローパスフィルタ",
    desc: "※結果算出までの時間が環境によっては1分以上かかります",
  },
  ans34: {
    title: "フーリエ変換 ハイパスフィルタ",
    desc: "※結果算出までの時間が環境によっては1分以上かかります",
  },
  ans35: {
    title: "フーリエ変換 バンドパスフィルタ",
    desc: "※結果算出までの時間が環境によっては1分以上かかります",
  },
  ans36: {
    title: "JPEG圧縮 (Step.1)離散コサイン変換",
    desc: "",
  },
  ans37: {
    title: "PSNR",
    desc: "",
  },
  ans38: {
    title: "JPEG圧縮 (Step.2)DCT+量子化",
    desc: "",
  },
  ans39: {
    title: "JPEG圧縮 (Step.3)YCbCr表色系",
    desc: "",
  },
  ans40: {
    title: "JPEG圧縮 (Step.4)YCbCr+DCT+量子化",
    desc: "",
  },
  ans41: {
    title: "Cannyエッジ検出 (Step.1) エッジ強度",
    desc: "",
  },
  ans42: {
    title: "Cannyエッジ検出 (Step.2) 細線化",
    desc: "",
  },
  ans43: {
    title: "Cannyエッジ検出 (Step.3) ヒステリシス閾処理",
    desc: "",
  },
  ans44: {
    title: "Hough変換・直線検出 (Step.1) Hough変換",
    desc: "",
  },
  ans45: {
    title: "Hough変換・直線検出 (Step.2) NMS",
    desc: "",
  },
  ans46: {
    title: "Hough変換・直線検出 (Step.3) Hough逆変換",
    desc: "",
  },
  ans47: {
    title: "モルフォロジー処理(膨張)",
    desc: "",
  },
  ans48: {
    title: "モルフォロジー処理(収縮)",
    desc: "",
  },
  ans49: {
    title: "オープニング処理",
    desc: "",
  },
  ans50: {
    title: "クロージング処理",
    desc: "",
  },
  ans51: {
    title: "モルフォロジー勾配",
    desc: "",
  },
  ans52: {
    title: "トップハット変換",
    desc: "",
  },
  ans53: {
    title: "ブラックハット変換",
    desc: "",
  },
  ans54: {
    title: "テンプレートマッチング SSD",
    desc: "",
  },
  ans55: {
    title: "テンプレートマッチング SAD",
    desc: "",
  },
  ans56: {
    title: "テンプレートマッチング NCC",
    desc: "",
  },
  ans57: {
    title: "テンプレートマッチング ZNCC",
    desc: "",
  },
  ans58: {
    title: "ラベリング 4近傍",
    desc: "",
  },
  ans59: {
    title: "ラベリング 8近傍",
    desc: "",
  },
  ans60: {
    title: "アルファブレンド",
    desc: "",
  },
  ans61: {
    title: "4-連結数",
    desc: "",
  },
  ans62: {
    title: "8-連結数",
    desc: "",
  },
  ans63: {
    title: "細線化処理",
    desc: "",
  },
  ans64: {
    title: "ヒルディッチの細線化",
    desc: "",
  },
  ans65: {
    title: "Zhang-Suenの細線化",
    desc: "",
  },
  ans70: {
    title: "カラートラッキング",
    desc: "",
  },
  ans71: {
    title: "マスキング",
    desc: "",
  },
  ans72: {
    title: "マスキング(カラートラッキング＋モルフォロジー)",
    desc: "",
  },
  ans73: {
    title: "縮小と拡大",
    desc: "",
  },
  ans74: {
    title: "ピラミッド差分による高周波成分の抽出",
    desc: "",
  },
  ans75: {
    title: "ガウシアンピラミッド",
    desc: "",
  },
  ans76: {
    title: "顕著性マップ",
    desc: "",
  },
  ans77: {
    title: "ガボールフィルタ",
    desc: "",
  },
  ans78: {
    title: "ガボールフィルタの回転",
    desc: "",
  },
  ans79: {
    title: "ガボールフィルタによるエッジ抽出",
    desc: "",
  },
  ans80: {
    title: "ガボールフィルタによる特徴抽出",
    desc: "",
  },
  ans81: {
    title: "Hessianのコーナー検出",
    desc: "",
  },
  ans82: {
    title: "Harrisのコーナー検出 (Step.1) Sobel + Gauusian",
    desc: "",
  },
  ans83: {
    title: "Harrisのコーナー検出 (Step.2) コーナー検出",
    desc: "",
  },
  ans84: {
    title: "簡単な画像認識 (Step.1) 減色化 + ヒストグラム",
    desc: "",
  },
  ans85: {
    title: "簡単な画像認識 (Step.2) クラス判別",
    desc: "",
  },
  ans86: {
    title: "簡単な画像認識 (Step.3) 評価(Accuracy)",
    desc: "",
  },
  ans87: {
    title: "簡単な画像認識 (Step.4) k-NN",
    desc: "",
  },
  ans88: {
    title: "K-means (Step.1) 重心作成",
    desc: "",
  },
}