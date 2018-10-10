export type ExpressSocketServerConfig = ExpressServerConfig & SocketServerConfig;

/**
 * An AbstractServer-compatible ExpressServer that shares resources with Socket.io.  Note that both of these connections
 * will use the same port.
 */
export class ExpressSocketServer extends Mixin<ExpressServer & SocketServerMixin>(ExpressServer, SocketServerMixin) {
	/**
	 * Constructs a new ExpressSocketServer
	 */
	constructor(options?: ExpressSocketServerConfig) {
		// Applies configurations
		super(options);

		// Add default configurations
		this.fillDefaults({
			ioOptions: {},
			ioConfig: function(io, server) {},
			namespaceConfig: function(namespace, server) {}
		});

		// Override default expressConfig
		this.configure({
			expressConfig: function(expressApp, server) {
				expressApp.get('/', function(req, res){
					res.send(
						'<h1>It Works!</h1>' +
						'<p>If you didn\'t specifically disable it, you should have access to io() in the console!</p>' +
						'<script src="/socket.io/socket.io.js"></script>'
					);
				});
			}
		});
	}

	/**
	 * Override to allow the options object to be of type ExpressSocketServerConfig.
	 */
	public configure(options: ExpressSocketServerConfig){
		super.configure(options);
	}

	/**
	 * Starts the ExpressSocketServer.
	 */
	public start(callback?: Function) {
		let cfg = this.config;

		// Call parent start() to init Express server
		super.start(callback);

		// Init and config socket.io server
		this.io = socketio(this.httpServer, cfg.ioOptions);
		cfg.ioConfig(this.io, this);
		this.initGlobalHandlers();
	}

	/**
	 * Stops the ExpressSocketServer.
	 */
	public stop(callback?: Function) {
		let that = this;

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function() {
				console.info('Stopped ' + that.getName() + ' on port ' + that.config.port);
			};

		// Stop socket communication...
		that.io.close(function(){
			// Then close the underlying httpServer...
			that.httpServer.close(function(){
				// Then reset and trigger the callback
				that.expressApp = null;
				that.httpServer = null;
				that.nsp = null;
				that.running = false;
				callback();
			});
		});
	}
}
