var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SocketServer } from './socket-server';
import { ExpressServer } from './express-server';
import { MixinDecorator } from 'ts-mixer';
/**
 * Simply mixes SocketServer and ExpressServer together into one class.
 */
// @ts-ignore: We know that SocketServer is abstract and we want it to stay that way
var SocketExpressServer = /** @class */ (function () {
    /**
     * Constructs a new SocketExpress Server.
     */
    function SocketExpressServer(options) {
        // @ts-ignore: we know there is a super
        _this = _super.call(this, options) || this; // eslint-disable-line
    }
    /**
     * Calls SocketServer#setup and ExpressServer#setup in succession to prevent them from overriding each other.
     */
    SocketExpressServer.prototype.setup = function (httpServer) {
        // @ts-ignore: we know setup is protected and we want it to stay that way
        SocketServer.prototype.setup(httpServer);
        // @ts-ignore: we know setup is protected and we want it to stay that way
        ExpressServer.prototype.setup(httpServer);
    };
    /**
     * Calls SocketServer#takedown and ExpressServer#takedown in succession to prevent them from overriding each other.
     */
    SocketExpressServer.prototype.takedown = function () {
        // @ts-ignore: we know takedown is protected and we want it to stay that way
        SocketServer.prototype.takedown();
        // @ts-ignore: we know takedown is protected and we want it to stay that way
        ExpressServer.prototype.takedown();
    };
    SocketExpressServer = __decorate([
        MixinDecorator(SocketServer, ExpressServer)
    ], SocketExpressServer);
    return SocketExpressServer;
}());
export { SocketExpressServer // Export both class and interface under one name
 };
