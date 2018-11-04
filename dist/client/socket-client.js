import * as socketio from 'socket.io-client';
/**
 * Basic socket client that can be used in Node or in the browser.
 */
var SocketClient = /** @class */ (function () {
    function SocketClient() {
        /**
         * Socket.io Socket instance for internal use.
         */
        this.socket = null;
    }
    /**
     * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
     * proper event will automatically be emitted.
     */
    SocketClient.prototype.handleEvent = function (ctx, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var _a;
        var response = (_a = this.socketHandlers[event]).call.apply(_a, [ctx].concat(args));
        if (response) {
            this.emit.apply(this, [response.name].concat(response.args));
        }
    };
    /**
     * Sets up the socket handlers for the client.
     */
    SocketClient.prototype.attachSocketHandlers = function () {
        var _this = this;
        // Build context for all handlers
        var ctx = {
            socket: this.socket,
            client: this
        };
        var _loop_1 = function (event) {
            this_1.socket.on(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.handleEvent.apply(_this, [ctx, event].concat(args));
            });
        };
        var this_1 = this;
        // Setup listeners for each event
        for (var event in this.socketHandlers) {
            _loop_1(event);
        }
    };
    /**
     * Returns whether or not the client has an active socket connection.
     */
    SocketClient.prototype.isConnected = function () {
        return this.socket && this.socket.connected;
    };
    /**
     * Returns the socket id if the client is connected.
     */
    SocketClient.prototype.getSocketId = function () {
        if (this.isConnected())
            return this.socket.id;
        else
            throw new Error('The client must first be connected to get the socket id');
    };
    /**
     * Attempts to connect to a SocketServer.  Returns a Promise for when the process completes or fails.
     */
    SocketClient.prototype.connect = function (url, options) {
        var _this = this;
        if (url === void 0) { url = ''; }
        if (!options)
            options = {};
        Object.assign(options, {
            autoConnect: false
        });
        return new Promise(function (resolve, reject) {
            _this.socket = socketio(url, options);
            _this.attachSocketHandlers();
            _this.socket.io.open(function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    };
    /**
     * Disconnects from the SocketServer, if there was a connection.
     */
    SocketClient.prototype.disconnect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.socket)
                _this.socket.close();
            _this.socket = null;
            resolve();
        });
    };
    /**
     * Emits an event to the connected SocketServer.  TypeScript ensures that the event adheres to the API description.
     */
    SocketClient.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.socket).emit.apply(_a, [event].concat(args));
    };
    return SocketClient;
}());
export { SocketClient };
