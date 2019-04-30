import Chart from "chart.js"

export default class {
  /**
   * canvasに画像を描画する
   * @param {Object} canvas 
   * @param {Object} image 
   */
  static drawImage(canvas, image) {
    image.addEventListener("load", () => {
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height)
    });
  }

  /**
   * ヒストグラムを描画する
   * @param {Object} canvas 
   * @param {Object} data 
   */
  static renderHistogram(canvas, data) {
    let labels = new Array(data.length).fill('')
    new Chart(canvas, {
      type: 'bar',
      data:{
        labels,
        datasets: [
          {
            label: '画素値',
            // data: [1, 2, 3, 4, 50, 6],
            data,
            backgroundColor: "rgba(80,80,80,0.5)"
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Histogram'
        },
        scales: {
          yAxes: [{
            ticks: {
              // suggestedMax: 100,
              suggestedMin: 0,
              // stepSize: 10000,
            }
          }]
        },
        animation: {
          duration: 0
        }
      }
    })
    //
  }
}