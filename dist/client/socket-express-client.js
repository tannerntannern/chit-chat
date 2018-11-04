var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MixinDecorator } from 'ts-mixer';
import { SocketClient } from './socket-client';
import { ExpressClient } from './express-client';
/**
 * Simply mixes SocketClient and ExpressClient together into one class.
 */
// @ts-ignore: We know that SocketClient is abstract and we want it to stay that way
var SocketExpressClient = /** @class */ (function () {
    function SocketExpressClient() {
    }
    SocketExpressClient = __decorate([
        MixinDecorator(SocketClient, ExpressClient)
    ], SocketExpressClient);
    return SocketExpressClient;
}());
export { SocketExpressClient };
