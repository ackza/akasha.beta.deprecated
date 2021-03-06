import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BlockStyles from './block-styles';
import ToggleButton from './toggle-button';

class SideMenu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false
        };
    }
    componentWillReceiveProps (nextProps) {
        // if (nextProps.editorHasFocus) {
        //     this.setState({
        //         open: false
        //     }, () => {
        //         this.props.onSidebarToggle(false);
        //     });
        // }
    }
    componentWillUnmount () {
        this.setState({
            open: false
        }, () => {
            this.props.onSidebarToggle(false);
        });
    }
    onChange = (editorState) => {
        this.props.onChange(editorState);
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        }, () => {
            this.props.onSidebarToggle(this.state.open);
        });
    }

    render () {
        return (
          <li className="sidemenu" id="sidebar-menu">
            <ToggleButton
              toggle={this.toggle}
              open={this.state.open}
              isVisible={this.props.sidebarVisible}
            />
            <BlockStyles
              editorState={this.props.editorState}
              plugins={this.props.plugins}
              open={this.state.open}
              onChange={this.onChange}
              toggle={this.toggle}
              showTerms={this.props.showTerms}
              onError={this.props.onError}
            />
          </li>
        );
    }
}
SideMenu.propTypes = {
    sidebarVisible: PropTypes.bool,
    plugins: PropTypes.arrayOf(PropTypes.shape()),
    editorState: PropTypes.shape(),
    onChange: PropTypes.func,
    showTerms: PropTypes.func,
    onSidebarToggle: PropTypes.func,
    onError: PropTypes.func
};

export default SideMenu;
