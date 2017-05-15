/// <reference path="../../typings/main.d.ts" />
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import GethEmitter from './event/GethEmitter';
import channels from '../channels';
import Logger from './Logger';
import { gethResponse } from './event/responses';
import { join } from 'path';
import { app } from 'electron';
import { getGenesisPath } from './config/genesis';
import IpcMainEvent = Electron.IpcMainEvent;
import WebContents = Electron.WebContents;

class GethIPC extends GethEmitter {
    public logger = 'geth';
    private BOOTNODE = 'enode://7f809ac6c56bf8a387ad3c759ece63bc4cde466c5f06b2d68e0f21928470dd35949e978091537e1fb633a' +
        '1a7eaf06630234d22d1b0c1d98b4643be5f28e5fe79@138.68.78.152:30301';
    private DEFAULT_MANAGED: string[] = ['startService', 'stopService', 'status'];

    constructor() {
        super();
        this.attachEmitters();
    }

    public initListeners(webContents: WebContents) {
        GethConnector.getInstance().setLogger(
            Logger.getInstance().registerLogger(this.logger)
        );
        GethConnector.getInstance().setBinPath(app.getPath('userData'));
        this.webContents = webContents;
        const datadir = GethConnector.getDefaultDatadir();
        GethConnector.getInstance().setOptions({
            bootnodes: this.BOOTNODE,
            datadir: join(datadir, 'akasha-alpha'),
            ipcpath: join(datadir, 'akasha-alpha', 'geth.ipc'),
            networkid: 511337,
            shh: ''
        });
        // register listeners
        this._start()
            ._restart()
            ._stop()
            ._syncStatus()
            ._logs()
            ._status()
            ._options()
            ._manager();
    }

    /**
     * Module ipc channel manager
     * @private
     */
    private _manager() {
        this.registerListener(
            channels.server.geth.manager,
            /**
             * @param event
             * @param data
             * @returns {any}
             */
            (event: any, data: IPCmanager) => {
                // listen on new channel
                if (data.listen) {
                    // check if already listening on channel
                    if (this.getListenersCount(data.channel) >= 1) {
                        // emit error
                        return this.fireEvent(
                            channels.client.geth.manager,
                            gethResponse({}, data, { message: `already listening on ${data.channel}` }),
                            event
                        );
                    }
                    // start listening for events on channel
                    this.listenEvents(data.channel);
                    // emit ok response
                    return this.fireEvent(channels.client.geth.manager, gethResponse({}, data), event);
                }
                // remove listener on `channel`
                return this.purgeListener(data.channel);
            }
        );
        // start listening immediately on `manager` channel
        this.listenEvents(channels.server.geth.manager);
        this.DEFAULT_MANAGED.forEach(
            (action: string) =>
                this.listenEvents(channels.server.geth[action])
        );
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _start() {
        this.registerListener(
            channels.server.geth.startService,
            (event: any, data: GethStartRequest) => {
                if (GethConnector.getInstance().serviceStatus.process) {
                    this.fireEvent(
                        channels.client.geth.startService,
                        gethResponse({}, { message: 'Service is already started.' }),
                        event
                    );
                    return null;
                }
                GethConnector.getInstance().writeGenesis(
                    getGenesisPath(),
                    (err: Error, stdout: any) => {
                        if (err) {
                            (Logger.getInstance().getLogger(this.logger)).error(err);
                        }
                        (Logger.getInstance().getLogger(this.logger)).info(stdout);
                        GethConnector.getInstance().start(data);
                    });
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _restart() {
        this.registerListener(
            channels.server.geth.restartService,
            (event: IpcMainEvent, data: GethRestartRequest) => {
                GethConnector.getInstance().restart(data.timer);
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _stop() {
        this.registerListener(
            channels.server.geth.stopService,
            (event: IpcMainEvent, data: GethStopRequest) => {
                GethConnector.getInstance().stop();
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _syncStatus() {
        this.registerListener(
            channels.server.geth.syncStatus,
            (event: any, data: any) => {
                return gethHelper
                    .inSync()
                    .then((state: any[]) => {
                            let response: GethSyncStatus;
                            if (!state.length) {
                                response = { synced: true };
                            } else {
                                response = { synced: false, peerCount: state[0] };
                                if (state.length === 2) {
                                    Object.assign(response, state[1]);
                                }
                            }
                            this.fireEvent(
                                channels.client.geth.syncStatus,
                                gethResponse(response, data),
                                event
                            );
                        }
                    )
                    .catch(err => {
                        this.fireEvent(
                            channels.client.geth.syncStatus,
                            gethResponse({}, data, { message: err.message }),
                            event
                        );
                    });
            }
        );
        return this;
    }

    /**
     *
     * @returns {GethIPC}
     * @private
     */
    private _logs() {
        this.registerListener(
            channels.server.geth.logs,
            (event: any, data: any) => {
                GethConnector.getInstance().logger.query(
                    { start: 0, limit: 20, order: 'desc' },
                    (err: Error, info: any) => {
                        let response: MainResponse;
                        if (err) {
                            response = gethResponse({}, data, { message: err.message });
                        } else {
                            response = gethResponse(info, data);
                        }
                        this.fireEvent(
                            channels.client.geth.logs,
                            response,
                            event
                        );
                    }
                );
            });
        return this;
    }

    /**
     * geth service status
     * @private
     */
    private _status() {
        this.registerListener(
            channels.server.geth.status,
            (event: any, data: any) => {
                if (!GethConnector.getInstance().serviceStatus.api) {
                    this.fireEvent(
                        channels.client.geth.status,
                        gethResponse({}, data),
                        event
                    );
                    return null;
                }
                let response;
                GethConnector.getInstance()
                    .web3
                    .eth
                    .getBlockNumberAsync()
                    .then((blockNr) => {
                        response = gethResponse({ blockNr }, data);
                    })
                    .catch((err) => {
                        response = gethResponse({}, data, { message: err.message });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client.geth.status,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    /**
     * Get or set geth spawn options
     * @returns {GethIPC}
     * @private
     */
    private _options() {
        this.registerListener(
            channels.server.geth.options,
            (event: any, data: any) => {
                const options = GethConnector.getInstance().setOptions(data);
                let mapObj = Object.create(null);
                for (let [k, v] of options) {
                    mapObj[k] = v;
                }
                this.fireEvent(
                    channels.client.geth.options,
                    gethResponse(mapObj, data),
                    event
                );
            }
        );
        return this;
    }
}
export default GethIPC;
