import { defineMessages } from 'react-intl';

const setupMessages = defineMessages({
    changeGethDataDir: {
        id: 'app.setup.changeGethDataDir',
        description: 'Label for changing geth data directory',
        defaultMessage: 'Change this if geth has different data directory'
    },
    gethDataDirPath: {
        id: 'app.setup.gethDataDirPath',
        description: 'geth datadir path field label',
        defaultMessage: 'Geth Datadir path'
    },
    changeGethAlreadyStarted: {
        id: 'app.setup.changeGethAlreadyStarted',
        description: 'input field placeholder text',
        defaultMessage: 'Change this if geth is already started with --ipcpath'
    },
    gethIPCPath: {
        id: 'app.setup.gethIPCPath',
        description: 'geth ipc path input placeholder',
        defaultMessage: 'Geth IPC Path'
    },
    changeIfIpfsRunning: {
        id: 'app.setup.changeIfIpfsRunning',
        description: 'ipfs input filed placeholder',
        defaultMessage: 'Change this if ipfs daemon is already running'
    },
    ipfsPath: {
        id: 'app.setup.ipfsPath',
        description: 'ipfs input field label',
        defaultMessage: 'Ipfs api path'
    },
    firstTimeSetupTitle: {
        id: 'app.setup.firstTimeSetupTitle',
        description: 'title for first time setup page',
        defaultMessage: 'First time setup'
    },
    akashaNextGenNetwork: {
        id: 'app.setup.akashaNextGenNetwork',
        description: 'akasha next gen description',
        defaultMessage: `AKASHA is a next-generation social blogging network powered by a new
                        kind of world computers known as Ethereum and the
                        Inter Planetary File System.`
    },
    youHaveNotHeared: {
        id: 'app.setup.youHavenNotHeared',
        description: 'You have not heard about these :)',
        defaultMessage: `If you haven’t heard of these technologies before don’t worry, simply
                        click next and we’ll take care of the rest.`
    },
    ifYouHaveEth: {
        id: 'app.setup.ifYouHaveEth',
        description: 'if you already have Ethereum',
        defaultMessage: `If you already have the Ethereum Go client or IPFS installed on your
                        machine please choose the advanced option.`
    },
    expressSetup: {
        id: 'app.setup.expressSetup',
        description: 'Express setup option checkbox',
        defaultMessage: 'Express setup'
    },
    advancedSetup: {
        id: 'app.setup.advancedSetup',
        description: 'Advanced setup option checkbox',
        defaultMessage: 'Advanced'
    },
    synchronizing: {
        id: 'app.setup.synchronizing',
        description: 'state of block sync',
        defaultMessage: 'Synchronising'
    },
    syncStopped: {
        id: 'app.setup.syncStopped',
        description: 'state of block sync',
        defaultMessage: 'Synchronization was stopped'
    },
    syncCompleted: {
        id: 'app.setup.syncCompleted',
        description: 'state of block sync',
        defaultMessage: 'Synchronization completed'
    },
    syncResuming: {
        id: 'app.setup.syncResuming',
        description: 'state of block sync',
        defaultMessage: 'Resuming synchronization...'
    },
    beforeSyncStart: {
        id: 'app.setup.beforeSyncStart',
        description: 'Message to show before sync is starting',
        defaultMessage: `We are starting synchronization with the Ethereum world computer.
                        Please be patient.`
    },
    onSyncStart: {
        id: 'app.setup.onSyncStart',
        description: 'Message to show when synchronizing',
        defaultMessage: `Your machine is currently synchronizing with the Ethereum world computer
                        network. You will be able to log in and enjoy the full AKASHA experience as
                        soon as the sync is complete.`
    },
    initializingTitle: {
        id: 'app.setup.initializingTitle',
        description: 'Title for initializing state page',
        defaultMessage: 'Initializing'
    },
    noProfilesFound: {
        id: 'app.setup.noProfilesFound',
        description: 'message if no local profiles found.',
        defaultMessage: 'No profiles found. Create a new identity or import an existing one.'
    },
    logInTitle: {
        id: 'app.setup.logInTitle',
        description: 'login page title',
        defaultMessage: 'Log in'
    },
    findingPeers: {
        id: 'app.setup.findingPeers',
        description: 'finding peers status',
        defaultMessage: 'Finding peers'
    },
    onePeer: {
        id: 'app.setup.onePeer',
        description: 'singular form of peers',
        defaultMessage: 'peer'
    },
    fewPeers: {
        id: 'app.setup.fewPeers',
        description: 'plural form of peer. depends on language',
        defaultMessage: 'peers'
    },
    manyPeers: {
        id: 'app.setup.manyPeers',
        description: 'in some languages there is another plural form of peers for many',
        defaultMessage: 'peers'
    },
    peers: {
        id: 'app.setup.peers',
        description: 'base plural form of peer',
        defaultMessage: 'peers'
    }
});

export { setupMessages };