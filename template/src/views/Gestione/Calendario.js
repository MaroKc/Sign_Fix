import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { Card, Collapse, CardBody, CardFooter, Button, Col, Row, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import axios from 'axios';

class Calendario extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeToken = this.changeToken.bind(this);

    this.state = {
      collapse: props.classe.token ? false : true,
      classe: props.classe,
      token: null,
      calendario: false
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  importCalendar() {
    this.setState({ calendario: this.state.token });
    this.toggle();
    axios.post('http://localhost:8080/calendar/importLessons', { token: this.state.token })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  changeToken(e) {
    this.setState({ token: e.target.value });
  }


  render() {
    const classe = this.state.classe;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>

                {this.state.calendario && (
                  <Iframe
                    url={"https://calendar.google.com/calendar/embed?src=" + this.state.calendario + "&ctz=Europe%2FRome"}
                    width="100%"
                    height="600"
                    style={{ border: 0 }}
                    frameborder="0"
                    scrolling="no"
                  />
                )}
              </CardBody>
              <Collapse isOpen={this.state.collapse}>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-calendar-check-o"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input className="col-lg-5" onChange={this.changeToken} placeholder={classe.token ? classe.token : "Goole Calendar Token"} type="text" id="calendarID" name="calendarID" />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.importCalendar()} type="button" color="secondary">{classe.token ? "Aggiorna" : "Salva"}</Button>
                    </InputGroupAddon>
                  </InputGroup>
                </CardBody>
              </Collapse>
              <CardFooter>
                <Button color="dark" onClick={this.toggle} className={'mb-1'} id="toggleCollapse" outline><i className="fa fa-cog"></i>&nbsp;Impostazioni</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Calendario;