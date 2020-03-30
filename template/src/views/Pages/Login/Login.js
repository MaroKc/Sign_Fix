import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Modal, ModalBody, ModalFooter, Table } from 'reactstrap';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

import Background from '../LandingPage/img/libro2.jpg';


class Login extends Component {

  constructor(props) {
    super(props);

    this.changeUser = this.changeUser.bind(this);
    this.changePswd = this.changePswd.bind(this);
    this.login = this.login.bind(this);
    this.googleauth = this.googleauth.bind(this);


    this.state = {
      user: null,
      pswd: null,
      status: false,
      warning: false,
      email: ''
    }
  }

  changeUser(e) {
    this.setState({ user: e.target.value });
  }
  changePswd(e) {
    this.setState({ pswd: e.target.value });
  }


  renderRedirect = () => {
    if (this.state.status) {
      return <Redirect to='/' />
    }
  }


  login() {
    axios.post('http://localhost:8080/auth', { email: this.state.user, pass: this.state.pswd })
      .then(res => {
        if (res.data.message === false) {
          ToastsStore.warning("Username o Password errati");
        } else {
          sessionStorage.setItem("utente", JSON.stringify(res.data.message));
          this.setState({ status: true });
        }
      })
  }

  googleauth = (cod) => {
    if (cod.code) {
      axios.post('http://localhost:8080/tokensignin', { code: cod.code })
        .then(res => {
          sessionStorage.setItem("utente", JSON.stringify(res.data.data));
          console.log(res.data.data)
          this.setState({ status: true });
        })
    } else {
      // There was an error.
    }
  }

  toggleWarning = () => {
    this.setState({
      warning: !this.state.warning
    })
  }

  forgotPassword = () => {
        axios.put('http://localhost:8080/forgotPassword',{
            email: this.state.email,
        })
            .then(res => {
                console.log('arrivato')
                if (res.data.message === "ok") 
                    {this.setState({warning: false})
                    ToastsStore.success("A breve ti arriverà la mail!")}
                else if (res.data.message === "ko") ToastsStore.warning("Controlla di aver inserito la mail corretta")
            })
            .catch(err => {
                return console.log(err);
            });
}


  openModalPassword = () => {
    return (
      <>
        <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
          className={'modal-primary ' + this.props.className}>
          <ModalBody>
            <div>
              Se la tua mail risulterà registrata ti invieremo una nuova password
              </div>
            <div>
              <Input name='email' onChange={(e) => this.setState({ email: e.target.value })} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.forgotPassword}>Continua</Button>{' '}
            <Button outline color="dark" onClick={this.toggleWarning}>Cancella</Button>
          </ModalFooter>
        </Modal>
      </> 
    )
}

  render() {
    return (
      <div className="app flex-row align-items-center" style={{backgroundImage: `url(${Background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
        {this.renderRedirect()}
        {this.openModalPassword()}
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h2 className="py-2">Supervisori</h2>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" onChange={this.changeUser} placeholder="Username" autoComplete="username" id="user" name="user" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" onChange={this.changePswd} placeholder="Password" autoComplete="current-password" id="pswd" name="pswd" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button style={{background: '#2c7d7d'}} onClick={this.login} className="px-4 text-white">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button  color='link' className="px-0" onClick={this.toggleWarning}>Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white" style={{background: '#2c7d7d'}}>
                  <CardBody className="text-center align-self-center">
                    <Col className="my-5 py-3">
                    <div>
                      <h2>Studenti</h2>
                      <GoogleLogin
                        clientId="122931835616-is0fj42a208qga441jf6bivffrb93trn.apps.googleusercontent.com"
                        scope="https://www.googleapis.com/auth/calendar.readonly profile email"
                        discoveryDocs="https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
                        buttonText="Login"
                        responseType='code'
                        accessType='offline'
                        cookiePolicy={'single_host_origin'}
                        onSuccess={this.googleauth}
                        onFailure={this.googleauth}
                        prompt='consent'
                      />
                    </div>
                    </Col>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        </Container>
      </div>
    );
  }
}

export default Login;