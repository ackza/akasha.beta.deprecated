import { createHash } from 'crypto';
import { totalmem } from 'os';
const hashPath = (...path: string[]) => {
    const hash = createHash('sha256');
    path.forEach((segment) => {
        hash.update(segment);
    });
    return hash.digest('hex');
};
const channels = {

    auth: ['login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities'],

    tags: ['checkFormat', 'create', 'tagIterator', 'tagSubIterator', 'exists', 'getTagsCreated', 'subsCount',
        'subscribe', 'getTagId', 'getTagName', 'unSubscribe', 'isSubscribed'],

    entry: ['getProfileEntriesCount', 'getTagEntriesCount', 'isActive', 'getEntry', 'publish', 'update', 'canClaim', 'claim',
        'downvote', 'getScore', 'getDepositBalance', 'upvote', 'voteCost', 'voteCount', 'entryTagIterator',
        'entryProfileIterator', 'votesIterator', 'getEntriesStream', 'getVoteOf'],

    comments: ['getComment', 'comment', 'commentsCount', 'removeComment', 'commentsIterator'],

    geth: ['options', 'startService', 'stopService', 'restartService', 'syncStatus', 'logs', 'status'],

    ipfs: ['startService', 'stopService', 'status', 'resolve', 'getConfig', 'setPorts', 'getPorts'],

    profile: ['getBalance', 'followProfile', 'getFollowersCount', 'getFollowingCount', 'getProfileData',
        'unFollowProfile', 'updateProfileData',  'followersIterator', 'followingIterator', 'isFollower', 'isFollowing'],

    registry: ['fetchRegistered', 'addressOf', 'checkIdFormat', 'getCurrentProfile', 'profileExists', 'registerProfile', 'getByAddress', 'unregister'],

    notifications: ['me', 'feed', 'setFilter'],

    tx: ['addToQueue', 'emitMined'],

    licenses: ['getLicenceById', 'getLicenses']
};

const processes = ['server', 'client'];
const mem = totalmem().toLocaleString();
const EVENTS: any = { client: {}, server: {} };
Object.keys(channels).forEach((attr) => {
    channels[attr].forEach((endpoint: string) => {
        processes.forEach((proc) => {
            if (!EVENTS[proc].hasOwnProperty(attr)) {
                EVENTS[proc][attr] = { manager: hashPath(proc, attr, mem, 'manager') };
            }
            EVENTS[proc][attr][endpoint] = hashPath(proc, attr, mem, endpoint);
        });
    });
});
export default { client: EVENTS.client, server: EVENTS.server };

