import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const tip = {
    id: '/tip',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        token: { type: 'string' },
        value: { type: 'string' },
        tokenAmount: { type: 'string' },
        message: { type: 'string' },
    },
    required: ['token'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, tip, { throwError: true });
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const tokenAmount = web3Api.instance.toWei(data.tokenAmount || 0, 'ether');
        const ethAmount = web3Api.instance.toWei(data.value || 0, 'ether');
        const address = yield (getService(COMMON_MODULE.profileHelpers))
            .profileAddress(data);
        const txData = contracts.instance.AETH
            .donate.request(address, tokenAmount, data.message || '', {
            value: ethAmount,
            gas: 200000,
        });
        const receipt = yield contracts.send(txData, data.token, cb);
        return {
            receipt,
            receiver: address,
            akashaId: data.akashaId,
        };
    });
    const sendTip = { execute, name: 'tip', hasStream: true };
    const service = function () {
        return sendTip;
    };
    sp().service(PROFILE_MODULE.sendTip, service);
    return sendTip;
}
//# sourceMappingURL=send-tip.js.map