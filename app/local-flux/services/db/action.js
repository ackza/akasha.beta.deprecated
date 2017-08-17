import Dexie from 'dexie';

const dbName = `action-akasha-alpha-${process.env.NODE_ENV}`;
const actionDB = new Dexie(dbName);
actionDB.version(1).stores({
    actions: '&id, akashaId, blockNumber, payload, status, tx, type, [akashaId+status]'
});

export default actionDB;