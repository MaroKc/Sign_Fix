import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { Card, Collapse, CardBody, CardFooter, Button, Col, Row, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import axios from 'axios';

class Calendario extends Component {

  constructor(props) {
    super(props);


    this.changeToken = this.changeToken.bind(this);

    this.state = {
      collapse: props.classe.token ? false : true,
      classe: props.classe,
      token: '',
      calendario: false
    };
  }

  toggle = ()=> {
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
      this.button()
  }

  changeToken(e) {
    this.setState({ token: e.target.value });
  }

  button() {
    if(!this.state.collapse){
      return(
        <CardFooter className="text-center">
        <Button color="dark" onClick={this.toggle} className={'mb-1'} id="toggleCollapse" outline><i className="fa fa-cog"></i>&nbsp;<b>Importa nuovo calendario</b></Button>
      </CardFooter>
      )
    }
  }

  render() {
   // const classe = this.state.classe;
    const validationCalendar = this.state.token.length === 52
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
                <CardBody className="my-auto mx-auto ">
                  <InputGroup className="w-auto">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-calendar-check-o"></i>
                      </InputGroupText>
                    </InputGroupAddon>
<<<<<<< HEAD
                    <Input className="col-lg-5" onChange={this.changeToken} placeholder={this.state.calendario ? this.state.calendario : "Goole Calendar Token"} type="text" id="calendarID" name="calendarID" />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.importCalendar()} type="button" color="secondary">{this.state.calendario ? "Aggiorna" : "Salva"}</Button>
=======
                    <Input className="col-lg-5" onChange={this.changeToken} invalid={!validationCalendar} valid={validationCalendar} placeholder={this.state.calendario ? this.state.calendario : "Goole Calendar Token"} type="text" id="calendarID" name="calendarID" />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.importCalendar()} disabled={!validationCalendar} type="button" color="secondary">{this.state.calendario ? "Aggiorna" : "Salva"}</Button>
>>>>>>> 85e255db548b680369f04bc23f7d40e4a24156ff
                    </InputGroupAddon>
                  </InputGroup>
                </CardBody>
              </Collapse>
              {this.button()}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Calendario;