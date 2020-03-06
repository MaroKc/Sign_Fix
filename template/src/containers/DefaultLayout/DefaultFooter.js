import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href="https://fitstic.it" target="_blank">FITSTIC</a> &copy; 2019.</span>
        <span className="ml-auto">Powered by <a href="http://www.cesarebrizio.it/Nonno_Laser.mp4" target="_blank">Sign_Fix</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
