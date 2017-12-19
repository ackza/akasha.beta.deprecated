import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { EntryList, Icon } from '../';
import { hidePreview } from '../../local-flux/actions/app-actions';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { selectColumn, selectColumnEntries } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';

class PreviewPanel extends Component {
    componentDidMount () {
        const { preview } = this.props;
        this.props.entryTagIterator({ columnId: 'previewColumn', value: preview.get('value') });
    }

    loadMoreEntries = () => {
        const { preview } = this.props;
        this.props.entryMoreTagIterator({ columnId: 'previewColumn', value: preview.get('value') });
    };

    render () {
        const { column, intl, preview, previewEntries } = this.props;

        return (
          <div className="preview-panel">
            <div className="preview-panel__header">
              <div className="preview-panel__title">
                {intl.formatMessage(dashboardMessages.previewTag, { tagName: preview.get('value') })}
              </div>
              <Icon
                className="content-link preview-panel__icon"
                onClick={this.props.hidePreview}
                type="close"
              />
            </div>
            <div className="preview-panel__list-wrapper">
              <EntryList
                contextId="previewColumn"
                entries={previewEntries}
                fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
                fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
                fetchMoreEntries={this.loadMoreEntries}
                moreEntries={column.getIn(['flags', 'moreEntries'])}
              />
            </div>
          </div>
        );
    }
}

PreviewPanel.propTypes = {
    column: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    hidePreview: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    preview: PropTypes.shape().isRequired,
    previewEntries: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        column: selectColumn(state, 'previewColumn'),
        preview: state.appState.get('showPreview'),
        previewEntries: selectColumnEntries(state, 'previewColumn'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreTagIterator,
        entryTagIterator,
        hidePreview
    }
)(injectIntl(PreviewPanel));