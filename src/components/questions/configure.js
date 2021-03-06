const imagesPath = "./images/";
const datasetPath = "./dataset/"

const srcImage = {
  lenna: imagesPath + "lenna.png",
  yasai: imagesPath + "yasai.jpg",
  default: imagesPath + "imori.jpg",
  noise: imagesPath + "imori_noise.jpg",
  dark: imagesPath + "imori_dark.jpg",
  gamma: imagesPath + "imori_gamma.jpg",
  thorino: imagesPath + "thorino.jpg",
  imori_part: imagesPath + "imori_part.jpg",
  seg: imagesPath + "seg.png",
  renketsu: imagesPath + "renketsu.png",
  gazo: imagesPath + "gazo.png",
}

const dataset = {
  tests: [
    datasetPath + "test_akahara_1.jpg",
    datasetPath + "test_akahara_2.jpg",
    datasetPath + "test_madara_1.jpg",
    datasetPath + "test_madara_2.jpg",
  ],
  train: [
    datasetPath + "train_akahara_1.jpg",
    datasetPath + "train_akahara_2.jpg",
    datasetPath + "train_akahara_3.jpg",
    datasetPath + "train_akahara_4.jpg",
    datasetPath + "train_akahara_5.jpg",
    datasetPath + "train_madara_1.jpg",
    datasetPath + "train_madara_2.jpg",
    datasetPath + "train_madara_3.jpg",
    datasetPath + "train_madara_4.jpg",
    datasetPath + "train_madara_5.jpg",
  ]
}

export default {
  srcImage,
  dataset,
  srcImageOption: {
    default: {
      label: 'imori',
      src: srcImage.default
    },
    lenna: {
      label: 'lenna',
      src: srcImage.lenna
    },
    yasai: {
      label: 'yasai',
      src: srcImage.yasai
    },
    noise: {
      label: 'imori noise',
      src: srcImage.noise
    },
    dark: {
      label: 'imori dark',
      src: srcImage.dark
    },
    gamma: {
      label: 'gamma',
      src: srcImage.gamma
    },
    thorino: {
      label: 'thorino',
      src: srcImage.thorino
    },
    seq: {
      label: 'segmentation',
      src: srcImage.seg
    },
    renketsu: {
      label: 'renketsu',
      src: srcImage.renketsu
    },
    gazo: {
      label: 'gazo',
      src: srcImage.gazo
    },
  },
}