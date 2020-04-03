import React, { Component } from 'react';
import { Col, Container, InputGroup, Row, Card } from 'reactstrap';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import axios from 'axios';
import Background from '../LandingPage/img/libro2.jpg';

class Badge extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      axios.post('http://localhost:8080/badge', { qr: event.target.value })
      .then(res => {
        if (res.data.error === false) {
          this.setState({message: res.data.message});
        } else {
          ToastsStore.warning(res.data.message);
        }
      })
    }
  }


  today(){
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();


if (month.length < 2)
    month = '0' + month;
if (day.length < 2)
    day = '0' + day;

let data = new Date();

let giorno = data.getDay();
let mese = data.getMonth();


if (giorno === 0) giorno = "Domenica";
if (giorno === 1) giorno = "Lunedì";
if (giorno === 2) giorno = "Martedì";
if (giorno === 3) giorno = "Mercoledì";
if (giorno === 4) giorno = "Giovedì";
if (giorno === 5) giorno = "Venerdì";
if (giorno === 6) giorno = "Sabato";

if (mese === 0) mese = "Gennaio";
if (mese === 1) mese = "Febbraio";
if (mese === 2) mese = "Marzo";
if (mese === 3) mese = "Aprile";
if (mese === 4) mese = "Maggio";
if (mese === 5) mese = "Giugno";
if (mese === 6) mese = "Luglio";
if (mese === 7) mese = "Agosto";
if (mese === 8) mese = "Settembre";
if (mese === 9) mese = "Ottobre";
if (mese === 10) mese = "Novembre";
if (mese === 11) mese = "Dicembre";

return (giorno + ' ' + day + ' ' + mese + ' ' + year)
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}


  render() {
    var d = new Date();
    var h = this.addZero(d.getHours());
    var m = this.addZero(d.getMinutes());

    return (
      <>
        <div className="app flex-row align-items-center" style={{backgroundImage: `url(${Background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <Card>
              <span className="clearfix">
                <h2 className="pt-3 text-center mt-3"> <b>{this.today()}</b></h2>
                <hr />
                <h4 className="text-center mb-4">Passa il tuo QR code personale nel lettore per registrare la tua presenza</h4>
                <h1 className="mt-3 text-center">{this.state.message}</h1>
              </span>

              </Card>

            </Col>
          </Row>
          <InputGroup className="input-prepend">
                <input ref={(input) => { this.nameInput = input; }} size="16" type="text" id="badge" name="badge" style={{ opacity: 0}} onKeyPress={this.keyPressed} />
              </InputGroup>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        </Container>
      </div>
      </>
    )
  }
}


export default Badge;
