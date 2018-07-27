"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        let connected = web3Api.instance.isConnected();
        connected = web3Api.instance.isConnected();
        yield getService(constants_1.CORE_MODULE.CONTRACTS).init();
        return { started: connected };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(constants_1.GETH_MODULE.startService, service);
    return startService;
}
exports.default = init;
//# sourceMappingURL=start.js.map