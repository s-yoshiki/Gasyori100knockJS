import Chart from "chart.js"

export default class {
  static drawImage(canvas, image) {
    image.addEventListener("load", () => {
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height)
    });
  }

  static renderHistogram(canvas, data) {
    let labels = new Array(255).fill('')
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
              // stepSize: 10,
            }
          }]
        },
      }
    })
  }
}