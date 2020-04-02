import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';
import InfoStudente from './InfoStudente';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

class Studenti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      studenti: [],
      displayCard: null,
      idCorso: this.props.classe["id"],
      displayTab: false,
      warning: false,
      result: '',
      file: '',
      val: ''
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
          percentage: item.percentage < 80 ? <div className="text-danger">{item.percentage}%</div> : <div className="text-success">{item.percentage}%</div>,
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

   handleChange = (event) => {
     try {
      var file = event.target.files[0];
      this.setState({file})
      var reader = new FileReader();
      reader.onload = (e) => this.setState({ result: e.target.result })
      reader.readAsText(file);
      this.toggleWarning(event)
      event.target.value = ''
     } catch (error) {

     }
   
  }

  getCsv = () => {
    axios.post('http://localhost:8080/importCsv/'+this.state.idCorso, {data: this.state.result})
    .then(res => res.data)
    .then(res => {
      if (res.message === "ok") ToastsStore.success("L'aggiunta del csv è avvenuta con successo!");else{ToastsStore.warning("OPSSSSSSS")}
      this.refresh()
      this.toggleWarning()  
    })
    .catch(err => console.error(err));
    
  }

  formatHours(hours) {
    var startLessonAppoggio = (hours.toString()).split('.')
    return startLessonAppoggio[0]
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

      if (ritirato.length !== 0) {
        return (
          <div>
          <Card>
          <CardHeader>
                <Row>
                  <Col sm="4">
                  <Input type="file" id="result" name="result" onChange={this.handleChange} style={ { opacity: 0 } }  /> 
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h3><b>STUDENTI</b></h3></span>
                  </Col>
                  <Col sm="4" className="text-right">
                      <Button className="custom-btn"><label className="m-0" htmlFor="result"><i className="cui-user-follow icons font-2xl d-block"></i>Importa file studenti</label></Button>      
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
              <h4 className="text-center font-weight-bold">STUDENTI  RITIRATI</h4>
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
                  <Input type="file" id="result" name="result" onChange={this.handleChange} style={ {opacity: 0 } }  /> 
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h3><b>STUDENTI</b></h3></span>
                  </Col>
                  <Col sm="4" className="text-right">
                      <Button className="custom-btn"><label className="m-0" htmlFor="result"><i className="cui-user-follow icons font-2xl d-block"></i>Importa file studenti</label></Button>      
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
      return <InfoStudente idCorso={this.state.idCorso} studente={this.state.studenti.find((studente) => studente.email === this.state.displayCard)} getStudents={this.getStudents} displayTable={this.displayTable}/>
    }else{
      return (
        <>
          {DatatablePage()}
        </>
      )
    }
  }


  toggleWarning = (event) => {
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
            Stai importando <b>{this.state.file['name']}</b>, i vecchi studenti verranno cancellati
            <h5 >Procedere?</h5>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.getCsv} color="danger">Continua</Button>{' '}
          <Button className="secondary" onClick={this.toggleWarning}>Cancella</Button>
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


