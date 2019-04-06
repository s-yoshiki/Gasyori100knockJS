const branch = "./images/";

const srcImage = {
    default: branch + "imori.jpg",
    noise: branch + "imori_noise.jpg",
    dark: branch + "imori_dark.jpg",
    gamma: branch + "imori_gamma.jpg",
    thorino: branch + "thorino.jpg",
    lenna: branch + "lenna.png",
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
    }
}