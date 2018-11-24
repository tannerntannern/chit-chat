"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_mixer_1 = require("ts-mixer");
var socket_client_1 = require("./socket-client");
var express_client_1 = require("./express-client");
/**
 * Simply mixes SocketClient and ExpressClient together into one class.
 */
// @ts-ignore: We know that SocketClient is abstract and we want it to stay that way
var SocketExpressClient = /** @class */ (function () {
    function SocketExpressClient() {
    }
    SocketExpressClient = __decorate([
        ts_mixer_1.MixinDecorator(socket_client_1.SocketClient, express_client_1.ExpressClient)
    ], SocketExpressClient);
    return SocketExpressClient;
}());
exports.SocketExpressClient = SocketExpressClient;
