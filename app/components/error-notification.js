import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification } from 'antd';
import { errorMessages } from '../locale-data/messages';
import { errorDisplay, errorDeleteNonFatal } from '../local-flux/actions/error-actions';


class ErrorNotification extends Component {
    componentWillReceiveProps (nextProps) {
        const { intl } = this.props;
        const { errorState } = nextProps;
        if (this.props.errorState.get('byId') !== errorState.get('byId')) {
            const err = errorState.get('byId').last();
            if (err && errorState.get('nonFatalErrors').indexOf(err.get('id') === -1)) {
                const message = err.get('messageId') ?
                intl.formatMessage(errorMessages[err.get('messageId')], err.get('values')) :
                err.get('message');
                const close = () => {
                    this.props.errorDeleteNonFatal(err.get('id'));
                };
                notification.open({
                    message,
                    duration: 0,
                    onClose: close
                });
                this.props.errorDisplay(err);
            }
        }
    }
    render () {
        return null;
    }
}

ErrorNotification.propTypes = {
    errorDisplay: PropTypes.func,
    errorDeleteNonFatal: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    errorState: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        errorState: state.errorState
    };
}

export default connect(
    mapStateToProps,
    {
        errorDisplay,
        errorDeleteNonFatal
    }
)(injectIntl(ErrorNotification));
