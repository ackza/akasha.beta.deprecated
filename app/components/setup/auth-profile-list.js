import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import { Avatar, DataLoader, LoginForm } from '../';
import { setupMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import { getDisplayName } from '../../utils/dataModule';
import { isVisible } from '../../utils/domUtils';

class AuthProfileList extends Component {
    container = null;
    selectedElement = null;
    state = {
        hoveredEthAddress: null,
        selectedEthAddress: null
    };

    componentDidUpdate (prevProps, prevState) {
        const { selectedEthAddress } = this.state;
        if (selectedEthAddress && selectedEthAddress !== prevState.selectedEthAddress) {
            this.clearTimeout();
            // This check is delayed because the transitions must be finished first
            this.timeout = setTimeout(this.checkIfVisible, 310, [selectedEthAddress]);
        }
    }

    componentWillUnmount () {
        this.clearTimeout();
    }

    componentClickAway = () => {
        this.setState({
            selectedEthAddress: null
        });
    };

    clearTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    checkIfVisible = (selectedEthAddress) => {
        const el = document.getElementById(`ethAddress-${selectedEthAddress}`);
        const { visible, scrollTop } = isVisible(el, this.container);
        if (el && this.container && !visible) {
            this.container.scrollTop -= scrollTop;
        }
        if (this.input) {
            this.input.focus();
        }
        this.timeout = null;
    }

    getContainerRef = (el) => {
        const { getListContainerRef } = this.props;
        this.container = el;
        if (getListContainerRef) {
            getListContainerRef(el);
        }
    };

    getInputRef = (el) => {
        if (el) {
            this.input = el;
        }
    };

    onCancelLogin = () => {
        this.setState({
            selectedEthAddress: null
        });
    };

    onSubmitLogin = () => {};

    onMouseEnter = (ethAddress) => {
        this.setState({
            hoveredEthAddress: ethAddress,
        });
    };

    onMouseLeave = () => {
        this.setState({
            hoveredEthAddress: null
        });
    };

    onSelectEthAddress = (ethAddress) => {
        this.setState({
            selectedEthAddress: ethAddress
        });
    };

    renderListItem = (profile) => {
        const { hoveredEthAddress, selectedEthAddress } = this.state;
        const hasName = profile.get('firstName') || profile.get('lastName');
        const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const avatar = profile.get('avatar');
        const akashaId = profile.get('akashaId');
        const ethAddress = profile.get('ethAddress');
        const isSelected = ethAddress === selectedEthAddress;
        const isHovered = ethAddress === hoveredEthAddress && !isSelected;
        const onClick = isSelected ? undefined : () => this.onSelectEthAddress(ethAddress);
        const title = hasName ? profileName : getDisplayName({ akashaId, ethAddress, long: true });
        const subtitle = hasName && akashaId;
        const withOpacity = selectedEthAddress && !isSelected;
        const cardClass = classNames('auth-profile-list__profile-card', {
            'auth-profile-list__profile-card_hovered': isHovered,
            'auth-profile-list__profile-card_selected': isSelected,
            'auth-profile-list__profile-card_with-opacity': withOpacity
        });
        const header = (
          <div className="auth-profile-list__card-header">
            <Avatar
              className="auth-profile-list__avatar"
              firstName={profile.get('firstName')}
              image={avatar}
              lastName={profile.get('lastName')}
            />
            <div className="auth-profile-list__header-text">
              <div className="overflow-ellipsis heading auth-profile-list__name">
                {title}
              </div>
              {subtitle &&
                <div className="auth-profile-list__akasha-id">
                  @{subtitle}
                </div>
              }
            </div>
          </div>
        );

        return (
          <div
            className={cardClass}
            id={`ethAddress-${ethAddress}`}
            key={ethAddress}
            onClick={onClick}
            onMouseEnter={() => this.onMouseEnter(ethAddress)}
            onMouseLeave={this.onMouseLeave}
          >
            {header}
            <ReactCSSTransitionGroup
              transitionName="loginForm"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {isSelected &&
                <LoginForm
                  akashaId={akashaId}
                  ethAddress={ethAddress}
                  getInputRef={this.getInputRef}
                  onCancel={this.onCancelLogin}
                  onSubmit={this.onSubmitLogin}
                />
              }
            </ReactCSSTransitionGroup>
          </div>
        );
    };

    render () {
        const { fetchingProfiles, profiles, intl } = this.props;

        if (profiles.size === 0 && !fetchingProfiles) {
            this.getContainerRef(null);
            return (
              <div className="auth-profile-list__root">
                <div className="auth-profile-list__placeholder">
                  <div className="content-link auth-profile-list__placeholder-link">
                    <a href="http://akasha.helpscoutdocs.com/article/16-how-to-migrate-accounts">
                      {intl.formatMessage(setupMessages.noProfilesFound)}
                    </a>
                  </div>
                </div>
              </div>
            );
        }

        return (
          <DataLoader flag={fetchingProfiles} style={{ paddingTop: '100px' }}>
            <div className="auth-profile-list__root">
              <div
                id="select-popup-container"
                className="auth-profile-list__list-wrapper"
                ref={this.getContainerRef}
              >
                {profiles.map(profile => this.renderListItem(profile))}
              </div>
            </div>
          </DataLoader>
        );
    }
}

AuthProfileList.propTypes = {
    fetchingProfiles: PropTypes.bool,
    getListContainerRef: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
};

export default clickAway(AuthProfileList);
