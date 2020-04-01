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
    const d = new Date()
    return (
      <React.Fragment>
        <span><a href="https://fitstic.it" target="_blank"  rel="noopener noreferrer">FITSTIC</a> &copy; {d.getFullYear()}</span>
        <span className="ml-auto">Powered by <a href="http://www.cesarebrizio.it/Nonno_Laser.mp4" target="_blank"  rel="noopener noreferrer">Sign_Fix</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
