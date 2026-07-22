/**
 * 入力画像とデータセットのパス定義。
 *
 * クリーン URL（/questions/12 など）を採用しているため相対パスは使えない。
 * Vite の BASE_URL を前置して、どの階層からでも解決できる絶対パスにする。
 */

const base = import.meta.env.BASE_URL
const imagesPath = `${base}images/`
const datasetPath = `${base}dataset/`

/** 単体の入力画像。 */
export const srcImage = {
  lenna: `${imagesPath}lenna.png`,
  yasai: `${imagesPath}yasai.jpg`,
  default: `${imagesPath}imori.jpg`,
  imori1: `${imagesPath}imori_1.jpg`,
  imoriMany: `${imagesPath}imori_many.jpg`,
  noise: `${imagesPath}imori_noise.jpg`,
  dark: `${imagesPath}imori_dark.jpg`,
  gamma: `${imagesPath}imori_gamma.jpg`,
  thorino: `${imagesPath}thorino.jpg`,
  imori_part: `${imagesPath}imori_part.jpg`,
  seg: `${imagesPath}seg.png`,
  renketsu: `${imagesPath}renketsu.png`,
  gazo: `${imagesPath}gazo.png`,
} as const

/** 識別問題（Q.83〜89）で使う学習・評価データセット。ファイル名がラベルを兼ねる。 */
export const dataset: { tests: string[]; train: string[] } = {
  tests: [
    `${datasetPath}test_akahara_1.jpg`,
    `${datasetPath}test_akahara_2.jpg`,
    `${datasetPath}test_madara_1.jpg`,
    `${datasetPath}test_madara_2.jpg`,
  ],
  train: [
    `${datasetPath}train_akahara_1.jpg`,
    `${datasetPath}train_akahara_2.jpg`,
    `${datasetPath}train_akahara_3.jpg`,
    `${datasetPath}train_akahara_4.jpg`,
    `${datasetPath}train_akahara_5.jpg`,
    `${datasetPath}train_madara_1.jpg`,
    `${datasetPath}train_madara_2.jpg`,
    `${datasetPath}train_madara_3.jpg`,
    `${datasetPath}train_madara_4.jpg`,
    `${datasetPath}train_madara_5.jpg`,
  ],
}

export interface SourceImageOption {
  label: string
  src: string
}

/** 入力画像セレクタに並ぶ選択肢。 */
export const srcImageOptions: readonly SourceImageOption[] = [
  { label: 'imori', src: srcImage.default },
  { label: 'imori 1', src: srcImage.imori1 },
  { label: 'imori many', src: srcImage.imoriMany },
  { label: 'lenna', src: srcImage.lenna },
  { label: 'yasai', src: srcImage.yasai },
  { label: 'imori (noise)', src: srcImage.noise },
  { label: 'imori (dark)', src: srcImage.dark },
  { label: 'imori (gamma)', src: srcImage.gamma },
  { label: 'thorino', src: srcImage.thorino },
  { label: 'segmentation', src: srcImage.seg },
  { label: 'renketsu', src: srcImage.renketsu },
  { label: 'gazo', src: srcImage.gazo },
]

export default { srcImage, dataset, srcImageOptions }
