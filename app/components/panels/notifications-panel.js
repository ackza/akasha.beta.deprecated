// @flow
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popover } from 'antd';
import type { List, Record, Map } from 'immutable';
import { Icon } from '../';
import { hideNotificationsPanel } from '../../local-flux/actions/app-actions';
import { notificationsSubscribe } from '../../local-flux/actions/notifications-actions';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { generalMessages, settingsMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import { selectLoggedEthAddress } from '../../local-flux/selectors';
import NotificationPanelSettings from './notification-panel-settings';
import NotificationList from './notification-list';

type Props = {
    darkTheme: boolean,
    notifications: List <Record>,
    notificationsLoaded: boolean,
    hideNotificationsPanel: Function,
    loggedEthAddress: string,
    userSettingsSave: Function,
    userPreference: Map <boolean>,
    notificationsSubscribe: Function,
    intl: Object,
    userSettings: Map<string,Record>
};
type State = {
    visibleSettings: boolean
};

class NotificationsPanel<PanelMembers> extends Component<Props, State> {
    constructor (props) {
        super(props);
        this.state = {
            visibleSettings: false
        };
    }
    containerRef = React.createRef();

    shouldComponentUpdate (nextProps, nextState) {
        const { darkTheme, notifications, notificationsLoaded, userSettings } = nextProps;
        
        if (
            this.state.visibleSettings !== nextState.visibleSettings ||
            darkTheme !== this.props.darkTheme ||
            !notifications.equals(this.props.notifications) ||
            !userSettings.get('notificationsPreference')
                .equals(this.props.userSettings.get('notificationsPreference')) ||
            notificationsLoaded !== this.props.notificationsLoaded
        ) {
            return true;
        }
        return false;
    }

    componentClickAway = () => {
        this.props.hideNotificationsPanel();
    };

    handleVisibleChange = (visible: boolean): void => {
        this.setState({ visibleSettings: visible });
        // if (!visible) {
        //     this.props.userSettingsSave(loggedEthAddress, { notificationsPreference });
        //     this.props.notificationsSubscribe(notificationsPreference);
        // }
    };

    render () {
        const { intl, userSettings, darkTheme, loggedEthAddress, notifications, notificationsLoaded } = this.props;

        return (
          <div className="notifications-panel">
            <div className="notifications-panel__header">
              <div className="notifications-panel__title">
                {intl.formatMessage(generalMessages.notifications)}
              </div>
              <div className="notifications-panel__more">
                <Popover
                  content={
                    <NotificationPanelSettings
                      loggedEthAddress={loggedEthAddress}
                      intl={intl}
                      userPreference={userSettings.get('notificationsPreference')}
                      userSettingsSave={this.props.userSettingsSave}
                      notificationsSubscribe={this.props.notificationsSubscribe}
                    />
                  }
                  id="notifications-panel__settings-popover"
                  onVisibleChange={this.handleVisibleChange}
                  overlayClassName="notifications-panel__settings-popover"
                  placement="bottomRight"
                  title={
                    <div className="flex-center-y notifications-panel__popover-title">
                      {intl.formatMessage(settingsMessages.notificationsPreference)}
                    </div>
                  }
                  trigger="click"
                  visible={this.state.visibleSettings}
                >
                  <Icon
                    className="content-link notifications-panel__more-icon"
                    type="more"
                  />
                </Popover>
              </div>
            </div>
            {/* {this.renderNotifications()} */}
            <NotificationList
              intl={intl}
              notifications={notifications}
              notificationsLoaded={notificationsLoaded}
              darkTheme={darkTheme}
            />
          </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
        loggedEthAddress: selectLoggedEthAddress(state),
        notifications: state.notificationsState.get('allNotifications'),
        notificationsLoaded: state.notificationsState.get('notificationsLoaded'),
        userSettings: state.settingsState.get('userSettings')
    };
}

export default connect(
    mapStateToProps,
    {
        hideNotificationsPanel,
        notificationsSubscribe,
        userSettingsSave
    }
)(injectIntl(clickAway(NotificationsPanel)));
