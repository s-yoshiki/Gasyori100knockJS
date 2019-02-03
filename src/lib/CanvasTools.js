
export default {
  drawImage(canvas, image) {
    image.addEventListener("load", () => {
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height)
    });
  }
}