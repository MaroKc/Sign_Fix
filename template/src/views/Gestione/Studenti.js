import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';
import InfoStudente from './InfoStudente';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

// import { AppSidebarToggler } from '@coreui/react';


//https://mdbootstrap.com/docs/react/tables/search/



class Studenti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      studenti: [],
      displayCard: null,
      idCorso: this.props.classe["id"],
      displayTab: false,
      warning: false
    }
  }


  componentDidMount() {
    this.getStudents();
  }

  getStudents = () => {
    axios.get('http://localhost:8080/listStudents/'+this.state.idCorso)
      .then(res => res.data)
      .then((data, index) => {
        const studenti = [];
        data.map(item => studenti.push({
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          dateOfBirth: item.dateOfBirth,
          residence: item.residence,
          fiscalCode: item.fiscalCode,
          hoursOfLessons: this.formatHours(item.hoursOfLessons),
          percentage: item.percentage,
          ritirato: item.ritirato,
          clickEvent: () => this.displayCard(item.email)
        }));
        this.setState({ studenti });
      })
      .catch(err => console.error(err));
  }

  refresh() {
    this.getStudents();
  }

  getCsv = () => {
    axios.get('http://localhost:8080/importCsv/'+this.state.idCorso)
    .then(res => res.data)
    .then(res => {
      if (res.message === "ok") ToastsStore.success("L'aggiunta del csv è avvenuta con successo!")
      else if (res.message === "ko") ToastsStore.danger("Ops, abbiamo un problema: " + res.data.data);
    })
    .catch(err => console.error(err));
    this.refresh()
    this.toggleWarning()
  }

  formatHours (hours){
    var startLessonAppoggio= (hours.toString()).split('.')
    var startLesson= ''
  
    if(startLessonAppoggio[1]){
      var startLessonSecondaParte=  startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1]+'0' :  startLessonAppoggio[1]
      startLesson= startLessonAppoggio[0]+': '+startLessonSecondaParte
      return startLesson
    }
    else{
      return startLessonAppoggio[0]
    }
  }

  displayCard = (e) => {
    this.setState({
      displayCard: e
    });
  }

  displayTable = () => {
    this.setState({
      displayCard: null
    });
  }

  tabPane() {
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
            label: 'Email',
            field: 'email',
          },
          {
            label: 'Ore totali',
            field: 'hoursOfLessons',
          },
          {
            label: '% Ore totali',
            field: 'percentage',
          },
        ],
        rows: this.state.studenti,
      };

      const nonRitirato = this.state.studenti.filter(el => el.ritirato === 0)
      const ritirato = this.state.studenti.filter(el => el.ritirato === 1)

      if (ritirato != 0) {
        return (
          <div>
          <Card>
          <CardHeader>
                <Row>
                  <Col sm="4">
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h4>STUDENTI REGISTRATI</h4></span>
                  </Col>
                  <Col sm="4" className="text-right">
                    <span> <Button color="ghost-success" className="mr-1"  onClick={this.toggleWarning}><i className="cui-user-follow icons font-2xl d-block"></i> Importa csv </Button> </span>
                  </Col>
                </Row>
              </CardHeader>
            <CardBody className="ml-4 mr-4">
              <MDBDataTable
                responsive
                hover
                data={{ columns: data.columns, rows: nonRitirato }}
                searching={false}
                paging={false}
                noBottomColumns={true}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader >
              <div className="text-center font-weight-bold">STUDENTI  RITIRATI</div>
            </CardHeader>
            <CardBody>
              <MDBDataTable
                responsive
                hover
                data={{ columns: data.columns, rows: ritirato }}
                searching={false}
                paging={false}
                noBottomColumns={true}
              // autoWidth={true}
              // refresh
              />
            </CardBody>
          </Card>
        </div>
        );
      } else {
        return (
          <div>
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="4">
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h4>STUDENTI REGISTRATI</h4></span>
                  </Col>
                  <Col sm="4" className="text-right">
                    <span> <Button color="ghost-success" className="mr-1" onClick={this.toggleWarning}><i className="cui-user-follow icons font-2xl d-block"></i> Importa csv </Button> </span>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <MDBDataTable
                  responsive
                  hover
                  data={{ columns: data.columns, rows: nonRitirato }}
                  searching={false}
                  paging={false}
                  noBottomColumns={true}
                />
              </CardBody>
            </Card>
          </div>
        )
      }
    }
    if(this.state.displayCard){
      return <InfoStudente studente={this.state.studenti.find((studente) => studente.email === this.state.displayCard)} getStudents={this.getStudents} displayTable={this.displayTable}/>
    }else{
      return (
        <>
          {DatatablePage()}
        </>
      )
    }
  }


  toggleWarning = () => {
    this.setState({
      warning: !this.state.warning,
    });
  }

  openModal = () => {
    return (
      <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
        className={'modal-danger ' + this.props.className}>
        <ModalHeader toggle={this.toggleWarning}>WARNING</ModalHeader>
        <ModalBody>
          <div className="text-center">
            Stai importando un <b>nuovo</b> csv, i vecchi studenti verranno cancellati
            <h5 >Procedere?</h5>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.getCsv} color="danger">Continua</Button>{' '}
          <Button color="secondary" onClick={this.toggleWarning}>Cancella</Button>
        </ModalFooter>
      </Modal>
    )
  }

  render() {
      return (
        <div>
          {this.tabPane()} {this.openModal()}
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        </div>
      )
  }
  }

export default Studenti;


