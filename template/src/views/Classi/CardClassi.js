import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import { Col, Row } from 'reactstrap';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  dataBox: PropTypes.func,
};


class CardClassi extends Component {

  render() {

    // eslint-disable-next-line
    const { children, className, cssModule, dataBox, ...attributes } = this.props;

    // demo purposes only
    const data = dataBox();
    const variant = data.variant;

    if (!variant || ['Turing', 'McLuhan', 'Tonioli', 'Hopper'].indexOf(variant) < 0) {
      return (null);
    }

    //const back = 'bg-' + variant;
    const back = 'bg-twitter';
    //const icon = 'fa fa-' + variant;
    const icon = variant;
    const keys = Object.keys(data);
    const vals = Object.values(data);

    const classCard = 'brand-card';
    const classCardHeader = classNames(`${classCard}-header`, back);
    const classCardBody = classNames(`${classCard}-body`);
    const classes =  mapToCssModules(classNames(classCard, className), cssModule);

    return (

      <div className={classes} style={{marginTop: 10, marginBottom: 10}}> 
        <div className={classCardHeader}>
          <i /*className={icon}*/>{icon}</i>
          {children}
        </div>
        <div className={classCardBody}>
          <div  style={{color: "#000011"}}>
            <Row>
              <Col>
              <div> <h1>{vals[2]}</h1></div>
              </Col>
              <Col>
              <div className="text-value">{vals[1]}</div>
            <div className="text-uppercase text-muted small">{keys[1]}</div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

CardClassi.propTypes = propTypes;

export default CardClassi;
