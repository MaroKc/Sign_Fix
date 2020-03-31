import React, { Component } from 'react';
import { Col, Container, InputGroup, Row } from 'reactstrap';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import axios from 'axios';

class Badge extends Component {

  componentDidMount() {
    this.nameInput.focus();
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      axios.post('http://localhost:8080/badge', { qr: event.target.value })
      .then(res => {
        if (res.data.error === false) {
          ToastsStore.success(res.data.message);
        } else {
          ToastsStore.warning(res.data.message);
        }
      })
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <span className="clearfix">
                <h1 className="float-left display-3 mr-4">500</h1>
                <h4 className="pt-3">Houston, we have a problem!</h4>
                <p className="text-muted float-left">The page you are looking for is temporarily unavailable.</p>
              </span>
              <InputGroup className="input-prepend">
                <input ref={(input) => { this.nameInput = input; }} size="16" type="text" placeholder="What are you looking for??"  onKeyPress={this.keyPressed} />
              </InputGroup>
            </Col>
          </Row>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        </Container>
      </div>
    );
  }
}

export default Badge;
