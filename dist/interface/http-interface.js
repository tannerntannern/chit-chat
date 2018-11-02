// TODO
// export type HttpHandlers<API extends HttpInterface, HandlerCtx> = {
// 	[Method in keyof API]: {
// 	[EP in keyof API[Method]]: API[Method] extends MethodWithoutArgs ?
// 		// @ts-ignore: Not sure why the compiler is complaining about this
// 		(this: HandlerCtx) => API[Method][EP]['return'] :
// 		// @ts-ignore: Not sure why the compiler is complaining about this
// 		(this: HandlerCtx, data: API[Method][EP]['args']) => API[Method][EP]['return'];
// } & {
// 	[extraHandler: string]: (this: HandlerCtx, data?: object) => any
// }
// } & {
// 	[Method in Exclude<keyof Method, keyof API>]?: {
// 		[extraHandler: string]: (this: HandlerCtx, data?: object) => any
// 	}
// };
