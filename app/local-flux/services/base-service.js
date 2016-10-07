import debug from 'debug';

const dbg = debug('App::BaseService::*');
/**
 * All services should extend this base services
 * it provides utilities for ipc.
 */
class BaseService {
    constructor () {
        // client channel listeners
        this._listeners = new Map();

        // manager channel listeners
        this._openChannels = new Set();
    }
    // create a universal listener passed to clientChannel.on() method;
    createListener = (onError, onSuccess, channelName = 'notSetChannel') =>
        (ev, res) => {
            dbg('response on channel', channelName, 'is', res);
            if (res.error) {
                return onError(res.error);
            }
            return onSuccess(res.data);
        };
    /**
     * Register a listener on a channel and store a reference to it
     * @param clientChannel <String> the channel we are receiving responses
     * @param listener <Function> the actual listener
     * @param cb <Function> callback
     */
    registerListener = (clientChannel, listener, cb) => {
        this._listeners.set(clientChannel.channel, listener);
        if (clientChannel.listenerCount > 0) {
            if (typeof cb === 'function') return cb();
            return null;
        }
        clientChannel.on((ev, res) => this._listeners.get(clientChannel.channel)(ev, res));
        if (typeof cb === 'function') return cb();
        return null;
    };
    /**
     * removes a listener
     */
    removeListener = (channel, cb) => {
        if (this._listeners.get(channel.channel)) {
            channel.removeListener(this._listeners.get(channel.channel));
        }
        this._listeners.delete(channel.channel);
        if (typeof cb === 'function') {
            return cb();
        }
        return null;
    };
    /** open communication with a channel through channel manager
     * @param serverManager <String> Server manager channel -> sending on this
     * @param clientManager <String> Client manager channel -> listening on this
     * @param serverChannel <String> The channel we need to open
     * @param clientChannel <String> The channel we receive response data
     * @param listenerCb <Function> The actual listener
     * @param cb <Function> callback
     * @TODO make this a promise
     */
    openChannel = ({
        serverManager,
        clientManager,
        serverChannel,
        clientChannel,
        listenerCb
    }, cb) => {
        if (this._openChannels.has(serverChannel.channel)) {
            // server channel already opened. Nothing to do!
            return cb();
        }
        clientManager.once((ev, res) => {
            if (res.error) {
                dbg(`${res.error.message}, please check base-service -> openChannel method`);
            }
            dbg(serverChannel.channelName, 'is now open to communication');
            this._openChannels.add(serverChannel.channel);
            return this.registerListener(clientChannel, listenerCb, cb);
        });
        return serverChannel.enable();
    };
    /** close communication with a channel through channel manager
     * @param manager <String> manager channel => we are sending req on this
     * @param channel <String> the server channel we need to stop listen
     */
    closeChannel = (serverManager, serverChannel, clientChannel) => {
        this.removeListener(clientChannel);
        this._openChannels.delete(serverChannel.channel);
        serverChannel.disable();
    };
}

export default BaseService;
