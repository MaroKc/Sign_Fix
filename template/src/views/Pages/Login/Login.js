import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';


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

      GoogleAuth: null,
      CLIENT_ID: '122931835616-is0fj42a208qga441jf6bivffrb93trn.apps.googleusercontent.com',
      DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      SCOPES: "https://www.googleapis.com/auth/calendar.readonly profile email"
    }
  }

  changeUser(e) {
    this.setState({ user: e.target.value });
  }
  changePswd(e) {
    this.setState({ pswd: e.target.value });
  }



  componentDidMount() {


  }

  renderRedirect = () => {
    if (this.state.status) {
      return <Redirect to='/classi' />
    }
  }

  login() {

    axios.post('http://localhost:8080/auth', { email: this.state.user, pass: this.state.pswd })
      .then(res => {

        if (res.data.error) {
          console.log("FAILs")
        } else {
          console.log(res.data.message)
          sessionStorage.setItem("utente", JSON.stringify(res.data.message));

          this.setState({ status: true });

        }
      })

  }

  googleauth = (cod) => {

    if (cod.code) {

      axios.post('http://localhost:8080/tokensignin', { code: cod.code })
        .then(res => {
          console.log("!")
          console.log(res);
          /*
          console.log(res.data.message)
          sessionStorage.setItem("utente", JSON.stringify(res.data.message));
          this.setState({ status: true });
          */

        })
    } else {
      // There was an error.
    }
  }


  render() {
    return (
      <div className="app flex-row align-items-center">
        {this.renderRedirect()}
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
                          <Button color="primary" onClick={this.login} className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Studenti</h2>
                      <p>Dovrai accedere solo al primo ingresso.</p>

                      <GoogleLogin
                        clientId="122931835616-is0f"
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
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
