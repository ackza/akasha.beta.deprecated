import React from 'react';
import { IconButton } from 'material-ui';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';

const ToggleButton = (props) => {
    let style = {
        opacity: 0,
        visibility: 'hidden'
    };
    if (props.open || props.isVisible) {
        style = {
            opacity: 1,
            visibility: 'visible'
        };
    }
    return (
      <IconButton type="button" style={style}>
        <AddCircle />
      </IconButton>
    );
};
ToggleButton.propTypes = {
    open: React.PropTypes.bool,
    isVisible: React.PropTypes.bool,
    toggle: React.PropTypes.func
};

export default ToggleButton;
