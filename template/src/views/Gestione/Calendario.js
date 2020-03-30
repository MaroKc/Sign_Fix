import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { Card, Collapse, CardBody, CardFooter, Button, Col, Row, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import axios from 'axios';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';


class Calendario extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeToken = this.changeToken.bind(this);
    this.classe = props.classe;

    this.state = {
      collapse: props.classe.token ? false : true,
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
    axios.post('http://localhost:8080/calendar/importLessons', { email: 'daniele.marocchi.studio@fitstic-edu.com', token: this.state.token, corso: this.classe.id})
      .then(res => {
        if(res.data.message ==='calendaroOk')  ToastsStore.success("Il calendario è stato importato con successo")
        if (res.data.message === 'calendarioKo') ToastsStore.warning("Errore durante l'importazione del calensario")
        //console.log(res);
        //console.log(res.data);
      })
  }

  changeToken(e) {
    this.setState({ token: e.target.value });
  }


  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
         

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
                
           
              <Collapse isOpen={this.state.collapse}>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-calendar-check-o"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input className="col-lg-5" onChange={this.changeToken} placeholder={this.state.calendario ? this.state.calendario : "Goole Calendar Token"} type="text" id="calendarID" name="calendarID" />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.importCalendar()} type="button" className="custom-btn">{this.state.calendario ? "Aggiorna" : "Salva"}</Button>
                    </InputGroupAddon>
                  </InputGroup>
                </CardBody>
              </Collapse>
              <CardFooter>
                <Button color="dark" onClick={this.toggle} className="custom-btn mb-1" id="toggleCollapse" outline><i className="fa fa-cog"></i>&nbsp;Impostazioni</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>

      </div>
    );
  }
}

export default Calendario;