import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LogoButton } from './';
import { AddEntryIcon, ChatIcon, EntriesIcon, PeopleIcon,
    SearchIcon, StreamsIcon } from './svg';
import { generalMessages } from '../locale-data/messages';
import panels from '../constants/panels';

class Sidebar extends Component {
    handleSearch = () => this.handlePanelShow(panels.search);
    _handleNewEntry = () => {
        console.log('new entry');
    }
    getWrapperProps = message => ({
        'data-tip': this.props.intl.formatMessage(message),
        'data-place': 'right'
    });
    _isSidebarVisible = (location) => {
        /**
         * specify blacklisted routes
         *  on which we should not show sidebar
         */
        const blackList = ['setup'];
        return !blackList.every(route => location.pathname.includes(route));
    }
    _checkActiveIcon = (name) => {
        const { location } = this.props;
        return location.pathname.includes(name);
    }

    render () {
        const { activeDashboard, draftsCount, loggedProfileData, location } = this.props;
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);
        const isLoggedIn = !!loggedProfileData.get('akashaId');
        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__entry-icon" >
              {(entriesCount > 0 || draftsCount > 0) ?
                <div {...this.getWrapperProps(generalMessages.myEntries)}>
                  <EntriesIcon
                    disabled={!isLoggedIn}
                    isActive={false}
                    onClick={this._handleNewEntry}
                  />
                </div> :
                <div {...this.getWrapperProps(generalMessages.addNewEntry)}>
                  <AddEntryIcon
                    disabled={!isLoggedIn}
                    isActive={this._checkActiveIcon('draft/new')}
                    onClick={this._handleNewEntry}
                  />
                </div>
              }
              <div {...this.getWrapperProps(generalMessages.search)}>
                <SearchIcon
                  onClick={this.handleSearch}
                  isActive={false}
                />
              </div>
            </div>
            <div className="sidebar__stream-icon" >
              <div {...this.getWrapperProps(generalMessages.stream)}>
                <Link to={`/dashboard/${activeDashboard || ''}`}>
                  <StreamsIcon isActive={this._checkActiveIcon('dashboard')} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.people)}>
                <Link to="/people">
                  <PeopleIcon isActive={this._checkActiveIcon('people')} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.chat)}>
                <Link to="/chat">
                  <ChatIcon isActive={this._checkActiveIcon('chat')} />
                </Link>
              </div>
            </div>
            <div className="sidebar__logo">
              <LogoButton />
            </div>
          </div>
        );
    }
}

Sidebar.propTypes = {
    activeDashboard: PropTypes.string,
    draftsCount: PropTypes.number,
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
};

export default Sidebar;
