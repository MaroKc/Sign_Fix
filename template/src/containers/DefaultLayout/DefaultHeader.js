import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AppSidebarToggler } from '@coreui/react';
// import logo from '../../assets/img/brand/logo.svg'


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {this.props.classe && <AppSidebarToggler className="d-lg-none"  mobile /> }
       
        {/* <AppNavbarBrand
        className=""
          full={{ src: logo, width: 89, height: 25, alt: 'SignFix' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'SignFix' }}
        /> */}
           {this.props.classe && <AppSidebarToggler className="d-md-down-none mr-auto"/> }
      </React.Fragment>     
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
