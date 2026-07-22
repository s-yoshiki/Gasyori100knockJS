/**
 * 画素バッファまわりの共通型。
 */

/**
 * 画素の並び。
 *
 * `ImageData.data`（Uint8ClampedArray）と、中間結果として使う素の `number[]` の
 * どちらも受けられるようにするための型。添字による読み書きと `length` しか使わない
 * ヘルパはこの型で受けるとよい。
 */
export type Pixels = number[] | ImageData['data']

/**
 * カーネル適用後の値を加工するコールバック。
 *
 * `undefined` を返した場合は「その画素には書き込まない」を意味する。
 */
export type KernelCallback = (value: number) => number | undefined

/**
 * カーネル適用の結果を、各項の配列と総和の両方から決めるコールバック。
 *
 * ソーベル応答の平均を取る場合など、総和だけでは足りないときに使う。
 * `undefined` を返した場合は「その画素には書き込まない」を意味する。
 */
export type KernelReduceCallback = (values: number[], sum: number) => number | undefined
