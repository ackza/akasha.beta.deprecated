const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';

/**
 * sends start Geth command to main process w/o options
 * @param {null | object} options
 * @return promise
 */
export function startGethService (options) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.geth.startService, options);
        ipcRenderer.on(EVENTS.client.geth.startService, (event, data) => {
            // no data means that something very bad happened
            // like losing the main process
            if (!data) {
                return reject('OMG! Main process doesn`t respond to us!');
            }
            // return reject({ status: false });
            return resolve(data);
        });
    });
}
export function stopGethService () {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.geth.stopService);
        ipcRenderer.on(EVENTS.client.geth.stopService, (event, data) => {
            // no data means that something very bad happened
            // like losing the main process
            if (!data) {
                return reject('OMG! Main process doesn`t respond to us!');
            }
            return resolve(data);
        });
    });
}
/**
 * Send start IPFS service command to main process. Optionally can pass options
 * @param {null | object} options
 * @return promise
 */
export function startIPFSService (options) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.ipfs.startService, options);
        ipcRenderer.on(EVENTS.client.ipfs.startService, (event, data) => {
            // no data means that something very bad happened
            // like losing the main process
            if (!data) {
                return reject('OMG! Main process doesn`t respond to us!');
            }
            return resolve(data);
        });
    });
}
export function stopIPFSService () {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.ipfs.stopService);
        ipcRenderer.on(EVENTS.client.ipfs.stopService, (event, data) => {
            // no data means that something very bad happened
            // like losing the main process
            if (!data) {
                return reject('OMG! Main process doesn`t respond to us!');
            }
            return resolve(data);
        });
    });
}
/**
 * Update sync status sent by main process
 * @param {function} cb callback
 */
export function updateSync (cb) {
    return ipcRenderer.on(EVENTS.client.geth.syncUpdate, (event, data) => {
        if (!data) {
            return cb('Main process does not respond!');
        }
        return cb(null, data);
    });
}

export function removeUpdateSync (listener, cb) {
    ipcRenderer.removeListener(EVENTS.client.geth.syncUpdate, listener);
    if (cb) {
        return cb();
    }
}
