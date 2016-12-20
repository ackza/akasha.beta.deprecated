import { AppActions, TransactionActions } from 'local-flux';
import { draftActionCreators } from './action-creators';
import { DraftService, EntryService } from '../services';
import { hashHistory } from 'react-router';

let draftActions = null;

class DraftActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (draftActions) {
            return draftActions;
        }
        this.dispatch = dispatch;
        this.draftService = new DraftService();
        this.entryService = new EntryService();
        this.transactionActions = new TransactionActions(dispatch);
        this.appActions = new AppActions(dispatch);
        draftActions = this;
    }

    // Must return a promise and also to dispatch actions
    createDraft = (akashaId, draft, showNotification) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('savingDraft')) {
                dispatch(draftActionCreators.startSavingDraft({
                    savingDraft: true
                }));
                return this.draftService.createOrUpdate({ akashaId, ...draft }).then((result) => {
                    dispatch(draftActionCreators.createDraftSuccess(result, {
                        savingDraft: false
                    }));
                    if (showNotification) {
                        this.appActions.showNotification({
                            id: 'draftSavedSuccessfully',
                            duration: 2000
                        });
                    }
                    return result;
                }).catch((reason) => {
                    dispatch(draftActionCreators.createDraftError(reason, {
                        savingDraft: false
                    }));
                    if (showNotification) {
                        this.appActions.showNotification({
                            id: 'draftSaveFailed',
                            duration: 2000
                        });
                    }
                });
            }
            return Promise.resolve();
        });
    // must return a promise.
    updateDraft = (changes, showNotification) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('savingDraft')) {
                dispatch(draftActionCreators.startSavingDraft({
                    savingDraft: true
                }));
                return this.draftService.createOrUpdate(changes).then((savedDraft) => {
                    dispatch(draftActionCreators.updateDraftSuccess(savedDraft, {
                        savingDraft: false
                    }));
                    if (showNotification) {
                        this.appActions.showNotification({
                            id: 'draftSavedSuccessfully',
                            duration: 2000
                        });
                    }
                    return savedDraft;
                }).catch((reason) => {
                    dispatch(draftActionCreators.updateDraftError(reason, {
                        savingDraft: false
                    }));
                    if (showNotification) {
                        this.appActions.showNotification({
                            id: 'draftSaveFailed'
                        });
                    }
                });
            }
            return Promise.resolve();
        });
    deleteDraft = (draftId) => {
        this.draftService.deleteDraft({
            draftId,
            onSuccess: deletedId => {
                this.appActions.showNotification({
                    id: 'draftDeletedSuccessfully',
                    duration: 2000
                });
                this.dispatch(draftActionCreators.deleteDraftSuccess(deletedId));
            },
            onError: error => {
                this.appActions.showNotification({
                    id: 'draftDeleteFailed'
                });
                this.dispatch(draftActionCreators.deleteDraftError(error));
            }
        });
    }
    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    publishDraft = (draft, gas = 4000000) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const token = loggedProfile.get('token');
            const flagOn = { draftId: draft.get('id'), value: true };
            const flagOff = { draftId: draft.get('id'), value: false };
            dispatch(draftActionCreators.publishDraft({ publishPending: flagOn }));
            this.entryService.publishEntry({
                draftObj: draft.toJS(),
                token,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'publishEntry',
                        draftId: draft.get('id')
                    }]);
                    this.appActions.showNotification({
                        id: 'publishingEntry',
                        values: { title: draft.getIn(['content', 'title']) }
                    });
                    hashHistory.push(`/${draft.get('akashaId')}/draft/${draft.get('id')}/publish-status`);
                },
                onError: error => dispatch(draftActionCreators.publishDraftError(error, {
                    publishPending: flagOff
                }))
            });
        });
    };
    /**
     * This action should be placed in entryActions ?
     * Or it should be renamed to publishDraftSuccess ?
     */
    publishEntrySuccess = (draftId, title) => {
        this.dispatch(draftActionCreators.publishDraftSuccess({
            publishPending: { draftId, value: false }
        }));
        this.appActions.showNotification({
            id: 'draftPublishedSuccessfully',
            values: { title }
        });
        this.deleteDraft(draftId);
    }

    getDrafts = (akashaId) => {
        draftActionCreators.getDrafts({ fetchingDrafts: true });
        this.draftService.getAllDrafts(akashaId)
            .then(result => this.dispatch(draftActionCreators.getDraftsSuccess(result, {
                fetchingDrafts: false
            })))
            .catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason, {
                fetchingDrafts: false
            })));
    };

    getDraftsCount = (akashaId) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().draftState.get('flags');
            if (!flags.get('fetchingDraftsCount') && !flags.get('draftsCountFetched')) {
                dispatch(draftActionCreators.getDraftsCount({
                    fetchingDraftsCount: true
                }));
                this.draftService.getDraftsCount({
                    akashaId,
                    onSuccess: result =>
                        dispatch(draftActionCreators.getDraftsCountSuccess(result, {
                            fetchingDraftsCount: false,
                            draftsCountFetched: true
                        })),
                    onError: reason => dispatch(draftActionCreators.getDraftsCountError(reason, {
                        fetchingDraftsCount: false,
                        draftsCountFetched: false
                    }))
                });
            }
        });
    };

    getDraftById = id =>
        this.draftService.getById({
            id,
            onSuccess: result => this.dispatch(draftActionCreators.getDraftByIdSuccess(result)),
            onError: error => this.dispatch(draftActionCreators.getDraftByIdError(error))
        });

    clearDraftState = () => this.dispatch(draftActionCreators.clearDraftState());
}

export { DraftActions };
