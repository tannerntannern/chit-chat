/// <reference types="node" />
import * as http from 'http';
import { SocketInterface } from '../interface/socket-interface';
import { HttpInterface } from '../interface/http-interface';
import { SocketServer, SocketServerConfig } from './socket-server';
import { ExpressServer, ExpressServerConfig } from './express-server';
/**
 * Defines how a SocketExpressServer may be configured.
 */
export declare type SocketExpressServerConfig<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> = SocketServerConfig<SocketAPI> & ExpressServerConfig<HttpAPI>;
interface SocketExpressServer<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> extends SocketServer<SocketAPI>, ExpressServer<HttpAPI> {
    configure(options?: SocketExpressServerConfig<SocketAPI, HttpAPI>): any;
}
/**
 * Simply mixes SocketServer and ExpressServer together into one class.
 */
declare abstract class SocketExpressServer<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> {
    /**
     * Constructs a new SocketExpress Server.
     */
    constructor(options?: SocketExpressServerConfig<SocketAPI, HttpAPI>);
    /**
     * Calls SocketServer#setup and ExpressServer#setup in succession to prevent them from overriding each other.
     */
    protected setup(httpServer: http.Server): void;
    /**
     * Calls SocketServer#takedown and ExpressServer#takedown in succession to prevent them from overriding each other.
     */
    protected takedown(): void;
}
export { SocketExpressServer };
