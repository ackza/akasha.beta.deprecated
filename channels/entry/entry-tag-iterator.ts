import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const entryTagIteratorS = {
  id: '/entryTagIterator',
  type: 'object',
  properties: {
    limit: { type: 'number' },
    toBlock: { type: 'number' },
    tagName: { type: 'string', minLength: 1, maxLength: 32 },
    reversed: { type: 'boolean' },
    totalLoaded: { type: 'number' },
  },
  required: ['toBlock', 'tagName'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, entryTagIteratorS, { throwError: true });

    const entryCount = yield (getService(CORE_MODULE.CONTRACTS))
    .instance.Tags.totalEntries(data.tagName);

    let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
    if (maxResults > entryCount.toNumber()) {
      maxResults = entryCount.toNumber();
    }
    if (!data.tagName || entryCount <= data.totalLoaded) {
      return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
      const nextTotal = data.totalLoaded + maxResults;
      if (nextTotal > entryCount) {
        maxResults = entryCount - data.totalLoaded;
      }
    }
    return getService(ENTRY_MODULE.helpers)
    .fetchFromTagIndex(Object.assign({}, data, {
      limit: maxResults,
      args: { tagName: data.tagName },
      reversed: data.reversed || false,
    }));
  });

  const entryTagIterator = { execute, name: 'entryTagIterator' };
  const service = function () {
    return entryTagIterator;
  };
  sp().service(ENTRY_MODULE.entryTagIterator, service);
  return entryTagIterator;
}
