import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, ProfileList } from '../';
import { profileMessages } from '../../locale-data/messages';
import { profileFollowingsIterator,
    profileMoreFollowingsIterator } from '../../local-flux/actions/profile-actions';
import { selectFetchingFollowings, selectFetchingMoreFollowings, selectFollowings,
    selectMoreFollowings } from '../../local-flux/selectors';

class ProfileFollowingsColumn extends Component {
    componentDidMount () {
        this.followingsIterator();
    }

    componentWillReceiveProps (nextProps) {
        const { ethAddress } = nextProps;
        if (this.props.ethAddress !== ethAddress) {
            this.followingsIterator(ethAddress);
        }
    }

    followingsIterator = (ethAddress) => {
        if (!ethAddress) {
            ethAddress = this.props.ethAddress;
        }
        this.props.profileFollowingsIterator({ context: 'profilePageFollowings', ethAddress });
    };

    followingsMoreIterator = () => {
        const { ethAddress } = this.props;
        this.props.profileMoreFollowingsIterator({ context: 'profilePageFollowings', ethAddress });
    };

    render () {
        const { fetchingFollowings, fetchingMoreFollowings, followings, intl, moreFollowings } = this.props;

        return (
          <div className="column">
            <ColumnHeader
              onRefresh={this.followingsIterator}
              notEditable
              readOnly
              title={intl.formatMessage(profileMessages.followings)}
            />
            <ProfileList
              context="profilePageFollowings"
              fetchingProfiles={fetchingFollowings}
              fetchingMoreProfiles={fetchingMoreFollowings}
              fetchMoreProfiles={this.followingsMoreIterator}
              moreProfiles={moreFollowings}
              profiles={followings}
            />
          </div>
        );
    }
}

ProfileFollowingsColumn.propTypes = {
    ethAddress: PropTypes.string.isRequired,
    fetchingFollowings: PropTypes.bool,
    fetchingMoreFollowings: PropTypes.bool,
    followings: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    moreFollowings: PropTypes.bool,
    profileFollowingsIterator: PropTypes.func.isRequired,
    profileMoreFollowingsIterator: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    return {
        fetchingFollowings: selectFetchingFollowings(state, ethAddress),
        fetchingMoreFollowings: selectFetchingMoreFollowings(state, ethAddress),
        followings: selectFollowings(state, ethAddress),
        moreFollowings: selectMoreFollowings(state, ethAddress),
    };
}

export default connect(
    mapStateToProps,
    {
        profileFollowingsIterator,
        profileMoreFollowingsIterator,
    }
)(injectIntl(ProfileFollowingsColumn));