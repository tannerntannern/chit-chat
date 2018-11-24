"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Mixin for shared socket functionality between the server and client.
 */
var SocketMixin = /** @class */ (function () {
    function SocketMixin() {
        /**
         * @internal
         */
        this.waiters = {};
    }
    /**
     * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
     * proper event will automatically be emitted.
     */
    SocketMixin.prototype.handleEvent = function (ctx, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var _a;
        // Process the response if there is one
        var response = (_a = this.socketHandlers[event]).call.apply(_a, [ctx].concat(args));
        if (response)
            this.reply(ctx, response);
        // Process any waiters
        var waiters = this.waiters[event];
        if (waiters) {
            for (var sTime in waiters) {
                clearTimeout(waiters[sTime].timeoutId); // Prevent the timeout from being triggered
                waiters[sTime].resolve(); // Resolve the promise
            }
        }
        this.waiters[event] = {};
    };
    /**
     * Gives the ability to block and wait for an event.  Usage: `await this.blockEvent('some-event');`
     */
    SocketMixin.prototype.blockEvent = function (event, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 5000; }
        return new Promise(function (resolve, reject) {
            if (!_this.waiters[event])
                _this.waiters[event] = {};
            // For the case that the event never arrives, we must setup a timeout function to reject the promise
            var timestamp = Date.now();
            var timeoutId = setTimeout(function () {
                _this.waiters[event][timestamp].reject();
                delete _this.waiters[event][timestamp];
            }, timeout);
            // Push our resolve and promise functions into the waiters structure.  If all goes well, they will be
            // by handleEvent when the event arrives
            _this.waiters[event][timestamp] = { resolve: resolve, reject: reject, timeoutId: timeoutId };
        });
    };
    return SocketMixin;
}());
exports.SocketMixin = SocketMixin;
