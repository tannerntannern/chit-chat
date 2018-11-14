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
        if (waiters)
            for (var _b = 0, waiters_1 = waiters; _b < waiters_1.length; _b++) {
                var waiter = waiters_1[_b];
                waiter();
            }
        this.waiters[event] = [];
    };
    /**
     * Gives the ability to block and wait for an event.  Usage: `await this.blockEvent('some-event');`
     */
    SocketMixin.prototype.blockEvent = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.waiters[event])
                _this.waiters[event] = [];
            _this.waiters[event].push(resolve);
        });
    };
    return SocketMixin;
}());
export { SocketMixin };
