const branch = "./images/";

const srcImage = {
    default: branch + "imori.jpg",
    noise: branch + "imori_noise.jpg",
    dark: branch + "imori_dark.jpg",
    gamma: branch + "imori_gamma.jpg",
    thorino: branch + "thorino.jpg",
    imori_part: branch + "imori_part.jpg",
    lenna: branch + "lenna.png",
    seg: branch + "seg.png",
    renketsu: branch + "renketsu.png",
}

export default {
    srcImage,
    srcImageOption: {
        default: {
            label: 'imori',
            src: srcImage.default
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
        lenna: {
            label: 'lenna',
            src: srcImage.lenna
        },
        seq: {
            label: 'segmentation',
            src: srcImage.seg
        },
        renketsu: {
            label: 'renketsu',
            src: srcImage.renketsu
        },
    }
}