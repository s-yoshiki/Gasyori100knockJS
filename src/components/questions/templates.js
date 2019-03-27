/**
 * Templateが見つからなかった時に表示
 */
export const BlankTemplate = `<h3>Comming soon.</h3>`
/**
 * 通常 && 2つのcanvasテンプレート
 */
export const DefaultTemplate = `
<div>
<canvas ref="canvas1"></canvas>
&nbsp;
<canvas ref="canvas2"></canvas>
<br>
<button ref="button-run" class="bt">run</button>
<br>
<div ref="msg"></div>
</div>
`
/**
 * canvasが3つ
 */
export const ThreeCanvasTemplate = `
<div>
<canvas ref="canvas1"></canvas>
&nbsp;
<canvas ref="canvas2"></canvas>
&nbsp;
<canvas ref="canvas3"></canvas>
<br>
<button ref="button-run" class="bt">run</button>
<br>
<div ref="msg"></div>
</div>
`
/**
 * canvasが4つ
 */
export const FourCanvasTemplate = `
<div>
<canvas ref="canvas1"></canvas>
&nbsp;
<canvas ref="canvas2"></canvas>
<br>
<canvas ref="canvas3"></canvas>
&nbsp;
<canvas ref="canvas4"></canvas>
<br>
<button ref="button-run" class="bt">run</button>
<br>
<div ref="msg"></div>
</div>
`
/**
 * ヒストグラム用
 */
export const HistogramTemplate = `
<div>
<canvas ref="canvas"></canvas>
<br>
<canvas ref="graph"></canvas>
<br>
<button ref="button-run" class="bt">run</button>
<br>
<div ref="msg"></div>
</div>
`

export default DefaultTemplate