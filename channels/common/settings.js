export const generalSettings = new Map();
export const BASE_URL = 'baseUrl';
export const OP_WAIT_TIME = 15000;
export const SHORT_WAIT_TIME = 48000;
export const MEDIUM_WAIT_TIME = 15000;
export const FULL_WAIT_TIME = 96000;
export const FOLLOWING_LIST = 'followingList';
export const BLOCK_INTERVAL = 5300;
export const F_STREAM_I = 'followingStreamIterator';
export const A_STREAM_I = 'allStreamIterator';
export const BACKUP_KEYS_NAME = 'akasha_keystore.zip';
export const FAUCET_TOKEN = '0x7016aec60a8cb208833d8cd9a05f5705a3600b2c2796180503373f56b3e0d959';
export const FAUCET_URL = 'https://akasha.fun/get/faucet';
export const GETH_LOGGER = 'geth';
export const IPFS_LOGGER = 'ipfs';
export const defaultPath = 'ipfs#akasha-beta';
export const DEFAULT_CIRCUIT_RELAYS = [
    '/p2p-circuit/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
    '/p2p-circuit/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
];
export const IPFS_CIRCUIT_RELAYS = [
    '/p2p-circuit/ipfs/QmTfTyKZXjzRo2C8NV6p21HCsxZF54Mm5cZ9GsfY3zpG3T',
    '/p2p-circuit/ipfs/QmTMSgsyw3zzVbcQnkoN5SRZk7WYUMorJ7EqkqVBLgn13i',
    '/p2p-circuit/ipfs/QmYfXRuVWMWFRJxUSFPHtScTNR9CU2samRsTK15VFJPpvh',
];
export const AKASHA_BOOTSTRAP_PEERS = [
    '/dns4/akasha.online/tcp/443/wss/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
    '/dns4/akasha.observer/tcp/443/wss/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
];
export const IPFS_BOOTSTRAP_PEERS = [
    '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
    '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
    '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
];
export const DEFAULT_IPFS_CONFIG = {
    Addresses: {
        Swarm: [
            '/dns4/akasha.cloud/tcp/443/wss/p2p-webrtc-star',
            '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        ],
        API: '',
        Gateway: '',
    },
    Bootstrap: IPFS_BOOTSTRAP_PEERS.concat(AKASHA_BOOTSTRAP_PEERS).concat(DEFAULT_CIRCUIT_RELAYS),
    Discovery: {
        MDNS: {
            Enabled: false,
            Interval: 10,
        },
        webRTCStar: {
            Enabled: true,
        },
    },
    EXPERIMENTAL: {
        pubsub: true,
        relay: {
            enabled: true,
            hop: {
                enabled: true,
            },
        },
    },
};
generalSettings.set(BASE_URL, 'https://gateway.ipfs.io/ipfs');
//# sourceMappingURL=settings.js.map