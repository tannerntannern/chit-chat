import { SocketClient } from './socket-client';
import { ExpressClient } from './express-client';
import { SocketInterface } from '../interface/socket-interface';
import { HttpInterface } from '../interface/http-interface';
/**
 * Simply mixes SocketClient and ExpressClient together into one class.
 */
declare abstract class SocketExpressClient<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> {
}
interface SocketExpressClient<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> extends SocketClient<SocketAPI>, ExpressClient<HttpAPI> {
}
export { SocketExpressClient };
