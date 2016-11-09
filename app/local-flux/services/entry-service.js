import entriesDB from './db/entry';
import BaseService from './base-service';

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

const Channel = window.Channel;


/**
 * Entry service
 * channels => ['publish', 'update', 'upvote', 'downvote', 'isOpenedToVotes', 'getVoteOf',
 *  'getVoteEndDate', 'getScore', 'getEntriesCount', 'getEntryOf', 'getEntry', 'getEntriesCreated',
 *  'getVotesEvent']
 * default open channels => ['getVoteEndDate', 'getScore', 'getEntry']
 */
class EntryService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.entry.manager;
        this.clientManager = Channel.client.entry.manager;
    }
    /**
     *  Publish a new entry
     *
     */
    publishEntry = ({ entry, profileAddress, onError, onSuccess }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.publish,
            clientChannel: Channel.client.entry.publish,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.publish.send(entry));
    };

    getEntriesCount = ({ profileAddress, onError, onSuccess }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getEntriesCount,
            clientChannel: Channel.client.entry.getEntriesCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.getEntriesCount.send(profileAddress));
    }

    // get resource by id (drafts or entries);
    getById = ({ table, id, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        })
        .then(entries => onSuccess(entries))
        .catch(reason => onError(reason));

    getSortedEntries = ({ sortBy }) =>
        new Promise((resolve) => {
            let entries = [];
            if (sortBy === 'rating') {
                entries = generateEntries(1);
                return resolve(entries);
            }
            if (sortBy === 'top') {
                entries = generateEntries(3);
                return resolve(entries);
            }
            entries = generateEntries(2);
            return resolve(entries);
        });
        // entriesDB.transaction('r', entriesDB.drafts, () => {
        //     if (sortBy === 'rating') {
        //         return entriesDB.drafts.where('tags').anyOf('top-rating').toArray();
        //     }
        //     if (sortBy === 'top') {
        //         return entriesDB.drafts.sortBy('status.created_at').toArray();
        //     }
        // });
    createSavedEntry = ({ akashaId, entry, onError, onSuccess }) =>
        entriesDB.transaction('rw', entriesDB.savedEntries, () => {
            entriesDB.savedEntries.add({ akashaId, ...entry.toJS() }).then(() => entry);
        })
        .then(() => onSuccess(entry))
        .catch(reason => onError(reason));

    getSavedEntries = ({ akashaId, onError, onSuccess }) =>
        entriesDB.transaction('r', entriesDB.savedEntries, () =>
            entriesDB.savedEntries.where('akashaId')
                .equals(akashaId)
                .toArray()
        )
        .then(entries => onSuccess(entries))
        .catch(reason => onError(reason));

    getEntriesForTag = () => {};
}

export { EntryService };
