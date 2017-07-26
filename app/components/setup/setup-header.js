import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../../locale-data/messages';
import { ServiceStatusBar } from '../';

const SetupHeader = ({ intl, split }) => (
  <div className="setup-header">
    <div className={`setup-header__title ${split && 'setup-pages_left'}`}>
      {intl.formatMessage(generalMessages.akasha)}
    </div>
    <div className="setup-header__services">
      <ServiceStatusBar />
    </div>
  </div>
);

SetupHeader.propTypes = {
    intl: PropTypes.shape(),
    split: PropTypes.bool
};

export default injectIntl(SetupHeader);
