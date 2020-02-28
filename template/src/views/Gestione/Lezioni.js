import React from 'react';
import { Card, CardBody, CardHeader, Button, Collapse, Row, Col } from 'reactstrap';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import { MDBDataTable } from 'mdbreact';


import 'react-datepicker/dist/react-datepicker.css';
// import { MDBDataTable } from 'mdbreact';


class Lezioni extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lezioniMattina: [],
      lezioniPomeriggio: [],
      studentiMattina: [],
      studentiPomeriggio: [],
      startDate: new Date(),
      collapse: false,
      accordion: [false, false],
    }
  }


  handleChange = date => {
      this.setState({
        startDate: date
      },()=> this.getLessons()); 
  }

  getLessons = () => {
      var data_appoggio = new Intl.DateTimeFormat('it', { year: 'numeric', day: '2-digit', month: '2-digit' }).format(this.state.startDate)
      var data_scelta = data_appoggio.replace(/[.*+?^${}/()|[\]\\]/g, '-')
      
      axios.get('http://localhost:8080/lessons/' + data_scelta)
      .then(res => res.data)
      .then((data) => {
        var lezioniMattina = [];
        var lezioniPomeriggio = [];

        data.map((item) => {
        if(item.startTime < 13){
        lezioniMattina.push({
          id: item.id,
          lesson: item.lesson,
          email: item.email,
          classroom: item.classroom,
          startTime: item.startTime,
          endTime: item.endTime,
        })
      }
      else{
        lezioniPomeriggio.push({
          id: item.id,
          lesson: item.lesson,
          email: item.email,
          classroom: item.classroom,
          startTime: item.startTime,
          endTime: item.endTime,
        })
      }
      });
        this.setState({ 
          lezioniMattina ,
          lezioniPomeriggio
        });
      })
      .catch(err => console.error(err));

      axios.get('http://localhost:8080/listSignaturesStudents/'+data_scelta)
        .then(res => res.data)
        .then((data) => {
          var studentiMattina = [];
          var studentiPomeriggio = [];

          data.map(item => {
            if(item.mattinaPomeriggio===0){
              studentiMattina.push({
                idLesson: item.idLesson,
                firstName: item.firstName,
                lastName: item.lastName,
                startTime: item.startTime,
                endTime: item.endTime
              })
            }
            else if(item.mattinaPomeriggio===1){
              studentiPomeriggio.push({
                idLesson: item.idLesson,
                firstName: item.firstName,
                lastName: item.lastName,
                startTime: item.startTime,
                endTime: item.endTime
              })
            }
          });
          this.setState(
            { studentiMattina, 
              studentiPomeriggio 
           });
        })
        .catch(err => console.error(err));

    }
  

  lezioneMattina = () => {
    let nomeLezione;
    let inizioLezione;
    let fineLezione;
    let classe;
    let email;

    this.state.lezioniMattina.map((mapItem) => {
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
        email = mapItem.email.split('@')[0];
    });
    if (nomeLezione) {
      return <>
        <Card className="m-4 ">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                  <h5 className="ml-4">mattina {inizioLezione} - {fineLezione}</h5>
                </Col>
                <Col className="col-sm-8">
                  Luogo: <b>{classe}</b>   Lezione: <b>{nomeLezione}</b>   Docente: <b>{email}</b>
                </Col>
              </Row>
              <div className="text-left">Assenti: <span className="text-danger">Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii</span> </div>
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              {this.tabPaneMattina()}
            </CardBody>
          </Collapse>
        </Card>
      </>
    }
  }

  lezionePomeriggio = () => {
    let nomeLezione;
    let inizioLezione;
    let fineLezione;
    let classe;
    let email;

    this.state.lezioniPomeriggio.map((mapItem) => {
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
        email = mapItem.email.split('@')[0];
    });

    if (nomeLezione) {
      return <>
        <Card className="m-4 ">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                  <h5 className="ml-4">pomeriggio   {inizioLezione} - {fineLezione}</h5>
                </Col>
                <Col className="col-sm-8">
                   <h5>Luogo: <b> {classe} </b>   Lezione: <b>{nomeLezione}</b>   Docente: <b>{email}</b></h5>
                </Col>
              </Row>
              <div className="ml-4">Assenti: <span className="text-danger">Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo CalbatebiiPaolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii Paolo Calbatebii</span> </div>
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              {this.tabPanePomeriggio()}
            </CardBody>
          </Collapse>
        </Card>
      </>
    }
  }



  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({
      accordion: state,
    });
  }



  tabPaneMattina() {
    const DatatablePage = () => {
      const data = {
        columns: [
          {
            label: 'Nome',
            field: 'firstName',
          },
          {
            label: 'Cognome',
            field: 'lastName',
          },
          {
            label: 'Entrata',
            field: 'startTime',
          },
          {
            label: 'Uscita',
            field: 'endTime',
          },
        ],
        rows: this.state.studentiMattina
      };

  return (
    <div>
      <Card>
        <CardBody>
          <MDBDataTable
            responsive
            hover
            data={data}
            searching={false}
            paging={false}
            noBottomColumns={true}
          />
        </CardBody>
      </Card>
    </div>
  );  
    }
    return (
      <>
        {DatatablePage()}
      </>
    )
  }
  

  tabPanePomeriggio() {
    const DatatablePage = () => {
      const data = {
        columns: [
          {
            label: 'Nome',
            field: 'firstName',
          },
          {
            label: 'Cognome',
            field: 'lastName',
          },
          {
            label: 'Entrata',
            field: 'startTime',
          },
          {
            label: 'Uscita',
            field: 'endTime',
          },
        ],
        rows: this.state.studentiPomeriggio
      };

  return (
    <div>
      <Card>
        <CardBody>
          <MDBDataTable
            responsive
            hover
            data={data}
            searching={false}
            paging={false}
            noBottomColumns={true}
          />
        </CardBody>
      </Card>
    </div>
  );  
    }
    return (
      <>
        {DatatablePage()}
      </>
    )
  }

  render() {
    return (
      <>
        <Card>
          <CardHeader className="text-center">
            <b>LEZIONI</b>
          </CardHeader>
          <CardBody>
            <div className="d-flex justify-content-center">
            <div className="form-group">
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                dateFormat="dd/MM/yyyy"
                className="border border-dark rounded text-center"
              />
               </div>

            </div>
            {this.lezioneMattina()}
            {this.lezionePomeriggio()}
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Lezioni