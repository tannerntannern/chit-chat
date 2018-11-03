import * as socketio from 'socket.io-client';
/**
 * Basic socket client that can be used in Node or in the browser.
 */
var SocketClient = /** @class */ (function () {
    function SocketClient() {
    }
    /**
     * TODO: ...
     */
    SocketClient.prototype.connect = function (url, options) {
        var _this = this;
        if (url === void 0) { url = ''; }
        return new Promise(function (resolve, reject) {
            _this.socket = socketio.connect(url, options);
            _this.io.once('connect', function () { resolve(true); });
            _this.io.once('connect_failed', function () { resolve(false); });
        });
    };
    /**
     * TODO: ...
     */
    SocketClient.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // ...
    };
    return SocketClient;
}());
export { SocketClient };
