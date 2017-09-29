import PropTypes from 'prop-types';
import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container'; // eslint-disable-line import/no-unresolved, import/extensions
import { CircularProgress, RaisedButton } from 'material-ui';

const REDIRECT_TIMEOUT = 5; // seconds
class PublishEntryStatus extends React.Component {
    componentDidMount () {
        document.body.style.overflow = 'hidden';
        this.timeout = setTimeout(this._handleReturn, REDIRECT_TIMEOUT * 1000);
    }
    // componentWillReceiveProps (nextProps) {
    //     const { drafts, params, pendingActions } = nextProps;
    //     const currentDraft = drafts.find(draft => draft.id === parseInt(params.draftId, 10));
    //     const currentDraftAction = pendingActions.find(action =>
    //         action.toJS().payload.draft.id === parseInt(params.draftId, 10)
    //     );
    //     const prevDraft = this.props.drafts.find(draft =>
    //         draft.id === parseInt(params.draftId, 10));
    //     // if ((prevDraft && !currentDraft) || !currentDraftAction) {
    //     //     this.context.router.push(`/${params.akashaId}/explore/tag`);
    //     // }
    // }
    shouldComponentUpdate (nextProps) {
        const { drafts, params, pendingActions } = nextProps;
        const currentDraft = drafts.find(draft => draft.id === parseInt(params.draftId, 10));
        const prevCurrentDraft = this.props.drafts.find(draft =>
            draft.id === parseInt(params.draftId, 10)
        );
        return prevCurrentDraft !== currentDraft ||
            pendingActions !== this.props.pendingActions;
    }
    componentWillUnmount () {
        document.body.style.overflow = 'initial';
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
    _handleReturn = () => {
        const { params, selectedTag } = this.props;
        const { router } = this.context;
        router.replace(`/${params.akashaId}/explore/tag/${selectedTag}`);
    }
    _getCurrentAction = () => { // eslint-disable-line consistent-return
        const { pendingActions, params } = this.props;
        const currentDraftAction = pendingActions.find(action =>
            action.toJS().payload.draft &&
            action.toJS().payload.draft.id === parseInt(params.draftId, 10)
        );
        switch (currentDraftAction.toJS().status) {
            case 'needConfirmation':
                return 'Waiting for publish confirmation!';
            case 'checkAuth':
                return 'Waiting for re-authentication!';
            case 'publishing':
                return 'Receiving transaction id';
            case 'publishComplete':
                return 'Publish complete. Redirecting...';
            default:
                break;
        }
    }
    render () {
        const { drafts, params, draftErrors } = this.props;
        const draftToPublish = drafts.find(draft =>
            draft.id === parseInt(params.draftId, 10));
        const isUpdateAction = draftToPublish && !!draftToPublish.get('entryId');
        const actionType = isUpdateAction ?
            'Updating' :
            'Publishing';

        return (
          <PanelContainer
            showBorder
            title={isUpdateAction ? 'Updating entry' : 'Publishing entry'}
            actions={[
                /* eslint-disable */
                <RaisedButton key="back-to-stream" label="Back to Home" primary onClick={this._handleReturn} />
                /* eslint-enable */
            ]}
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                zIndex: 16
            }}
          >
            <div className="col-xs-12" style={{ paddingTop: 32 }}>
              {!draftToPublish &&
                <div>Finding draft.. Please wait.</div>
              }
              {draftToPublish &&
                <div className="row" style={{ height: '100%' }}>
                  <div className="col-xs-12 center-xs" style={{ paddingTop: 64 }}>
                    <CircularProgress size={80} />
                  </div>
                  <div className="col-xs-12 center-xs">
                    <h3>{actionType} &quot;{draftToPublish.getIn(['content', 'title'])}&quot;</h3>
                    <p>Current Action: {this._getCurrentAction()}</p>
                    <p>This entry is being published. You will be redirected to home in {REDIRECT_TIMEOUT} seconds.</p>
                    {(draftErrors.size > 0) &&
                        draftErrors.map((err, key) =>
                          (<div key={key} style={{ color: 'red' }}>
                            Error {err.get('code') && err.get('code')}: {err.get('message')}
                          </div>)
                        )
                    }
                  </div>
                </div>
               }
            </div>
          </PanelContainer>
        );
    }
}
PublishEntryStatus.propTypes = {
    drafts: PropTypes.shape(),
    draftErrors: PropTypes.shape(),
    params: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    selectedTag: PropTypes.string
};
PublishEntryStatus.contextTypes = {
    router: PropTypes.shape()
};
export default PublishEntryStatus;
