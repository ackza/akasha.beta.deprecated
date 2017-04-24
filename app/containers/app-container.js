import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Redirect, Route } from 'react-router-dom';
import { getMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AuthDialog, DataLoader, GethDetailsModal, IpfsDetailsModal, PublishConfirmDialog,
    TransferConfirmDialog, WeightConfirmDialog } from '../shared-components';
import { hideNotification, hideTerms } from '../local-flux/actions/app-actions';
import { errorDeleteFatal, errorDeleteNonFatal } from '../local-flux/actions/error-actions';
import { HomeContainer, LauncherContainer, SidebarContainer } from './';
import { ErrorBar, FatalErrorModal, LoginDialog, NotificationBar, TermsPanel } from '../components';
import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

const AppContainer = (props) => {
    /* eslint-disable no-shadow */
    const { appState, errorDeleteFatal, errorDeleteNonFatal, errorState,
        hideNotification, hideTerms, intl, location, theme } = props;
    /* eslint-enable no-shadow */
    const isAuthDialogVisible = !!appState.get('showAuthDialog');
    const weightConfirmDialog = appState.get('weightConfirmDialog');
    const isWeightConfirmationDialogVisible = weightConfirmDialog !== null;
    const isPublishConfirmationDialogVisible = appState.get('publishConfirmDialog') !== null;
    const isTransferConfirmationDialogVisible = appState.get('transferConfirmDialog') !== null;
    const showGethDetailsModal = appState.get('showGethDetailsModal');
    const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
    const muiTheme = getMuiTheme(theme === 'light' ? lightTheme : darkTheme);

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <DataLoader flag={!appState.get('appReady')} size={80} style={{ paddingTop: '-50px' }}>
          <div className="fill-height" style={{ backgroundColor: muiTheme.palette.themeColor }} >
            {location.pathname === '/' && <Redirect to="/setup" />}
            <Route path="/setup" component={LauncherContainer} />
            <Route path="/dashboard" component={HomeContainer} />
            {!location.pathname.includes('/setup') && location.pathname !== '/' &&
              <SidebarContainer />
            }
            {!!appState.get('notifications').size &&
              <NotificationBar
                hideNotification={hideNotification}
                intl={intl}
                notification={appState.get('notifications').first()}
              />
            }
            {!!errorState.get('nonFatalErrors').size &&
              <ErrorBar
                deleteError={errorDeleteNonFatal}
                error={errorState.getIn(['byId', errorState.get('nonFatalErrors').first()])}
                intl={intl}
              />
            }
            {!!errorState.get('fatalErrors').size &&
              <FatalErrorModal
                deleteError={errorDeleteFatal}
                error={errorState.getIn(['byId', errorState.get('fatalErrors').first()])}
                intl={intl}
              />
            }
            {appState.get('showLoginDialog') && <LoginDialog />}
            {showGethDetailsModal && <GethDetailsModal />}
            {showIpfsDetailsModal && <IpfsDetailsModal />}
            {isAuthDialogVisible && <AuthDialog intl={intl} />}
            {isWeightConfirmationDialogVisible && <WeightConfirmDialog intl={intl} />}
            {isPublishConfirmationDialogVisible && <PublishConfirmDialog intl={intl} />}
            {isTransferConfirmationDialogVisible && <TransferConfirmDialog intl={intl} />}
            {appState.get('showTerms') && <TermsPanel hideTerms={hideTerms} />}
            <ReactTooltip delayShow={300} class="generic-tooltip" place="bottom" effect="solid" />
          </div>
        </DataLoader>
      </MuiThemeProvider>
    );
};

AppContainer.propTypes = {
    appState: PropTypes.shape().isRequired,
    errorDeleteFatal: PropTypes.func.isRequired,
    errorDeleteNonFatal: PropTypes.func.isRequired,
    errorState: PropTypes.shape().isRequired,
    hideNotification: PropTypes.func.isRequired,
    hideTerms: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    theme: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        appState: state.appState,
        errorState: state.errorState,
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

export { AppContainer };
export default connect(
    mapStateToProps,
    {
        errorDeleteFatal,
        errorDeleteNonFatal,
        hideNotification,
        hideTerms
    }
)(injectIntl(AppContainer));